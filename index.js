const express = require('express')
const path = require('path')
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')
const fetch = require("node-fetch");

const app = express()

app.use(express.urlencoded({ extended: false }))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

app.use( cookieSession ({
    name: 'session',
    keys: [ 'key1', 'key2' ],
    maxAge: 3600 * 1000
}))

const ifNotLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render('login', {
            data: false
        })
    }
    next()
}

const ifLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/home')
    }
    next()
}

app.get('/', ifNotLoggedIn, (req, res, next) => {
    fetch('https://bill-project-api.herokuapp.com/admin/get/data', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.session.token,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        res.render('home', {
            data: data.payload.data[0]
        })
    })
})

app.get('/item', ifNotLoggedIn, (req, res, next) => {
    fetch('https://bill-project-api.herokuapp.com/admin/get/data', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.session.token,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        res.render('item', {
            data: data.payload.data[0]
        })
    })
})

app.get('/cus', ifNotLoggedIn, (req, res, next) => {
    fetch('https://bill-project-api.herokuapp.com/admin/get/data', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.session.token,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        res.render('cus', {
            data: data.payload.data[0],
            success: false
        })
    })
})

app.get('/user', ifNotLoggedIn, (req, res, next) => {
    fetch('https://bill-project-api.herokuapp.com/admin/get/data', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.session.token,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        res.render('user', {
            data: data.payload.data[0]
        })
    })
})

app.get('/bill', ifNotLoggedIn, (req, res, next) => {
    fetch('https://bill-project-api.herokuapp.com/admin/get/data', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.session.token,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        res.render('bill', {
            data: data.payload.data[0]
        })
    })
})

app.get('/bill_create', ifNotLoggedIn, (req, res, next) => {
    fetch('https://bill-project-api.herokuapp.com/admin/get/data', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.session.token,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        res.render('bill_create', {
            data: data.payload.data[0],
            token: req.session.token,
            success: false
        })
    })
})

app.get('/cus_create', ifNotLoggedIn, (req, res, next) => {
    fetch('https://bill-project-api.herokuapp.com/admin/get/data', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.session.token,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        res.render('cus_create', {
            data: data.payload.data[0],
            success: false
        })
    })
})

app.get('/item_create', ifNotLoggedIn, (req, res, next) => {
    fetch('https://bill-project-api.herokuapp.com/admin/get/data', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.session.token,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        res.render('item_create', {
            data: data.payload.data[0],
            success: false
        })
    })
})

app.get('/cus_add_create', ifNotLoggedIn, (req, res, next) => {
    fetch('https://bill-project-api.herokuapp.com/admin/get/data', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.session.token,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        res.render('cus_add_create', {
            data: data.payload.data[0],
            success: false
        })
    })
})

app.post('/printpage', ifNotLoggedIn, (req, res, next) => {
    const { selectedBill } = req.body
    fetch('https://bill-project-api.herokuapp.com/bill/get/byBillId?billId='+selectedBill, {
        method: 'GET'
    }).then(res => res.json()).then(data => {
        res.render('print', {
            data: data.payload.data[0]
        })
    })
})

app.post('/login', ifLoggedIn, (req, res, next) => {
    const { username, password } = req.body
    fetch('https://bill-project-api.herokuapp.com/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    .then(res => res.json()).then(data => {
        if (data.success) {
            req.session.isLoggedIn = true
            req.session.token = data.payload.token
            res.redirect('/')
        } else {
            res.render('login', {
                data: data
            })
        }
    })
})

app.post('/createcus', ifNotLoggedIn, (req, res, next) => {
    const { customerName, customerTax } = req.body
    fetch('https://bill-project-api.herokuapp.com/customer/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "customerName": customerName,
            "taxNumber": customerTax
        })
    }).then(res => res.json()).then(data => {
        res.render('cus_create', {
            data: data,
            success: true,
            customerName: customerName
        })
    })
})

app.post('/createadd', ifNotLoggedIn, (req, res, next) => {
    const { customerId, customerAddress, customerSubdistrict } = req.body
    fetch('https://bill-project-api.herokuapp.com/address/insert/address', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "addressName": customerAddress,
            "addressDetail": customerAddress,
            "subDistrictId": customerSubdistrict,
            "customerId": customerId
        })
    }).then(res => res.json()).then(data => {
        res.render('cus_add_create', {
            data: data,
            success: true
        })
    })
})

app.post('/createitem', ifNotLoggedIn, (req, res, next) => {
    const { customerId, itemType, itemId, itemName, itemPrice } = req.body
    fetch('https://bill-project-api.herokuapp.com/product/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "productCode": itemId,
            "productDetail": itemName,
            "unitPrice": itemPrice,
            "productTypeId": itemType,
            "customerId": customerId
        })
    }).then(res => res.json()).then(data => {
        res.render('item_create', {
            data: data,
            success: true
        })
    })
})

app.get('/logout', (req, res) => {
    req.session = null
    res.redirect('/')
})

app.listen(3000, () => console.log("Server is running..."))