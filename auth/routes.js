const conex = require('../conf/oracledb-config')
const router = require('express').Router()
const passport = require("passport")

function loginRequired(req, res, next){
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }
    next()
}

router
    .use(function(req, res, next) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next()
    })
    .get('/login', (req, res) => res.render('login'))
    .post('/login', passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }))
    
    .get('/logout',(req, res, next) =>{
        req.session.destroy((err) => {
            res.clearCookie('connect.sid')
            res.redirect("/login")
        })
    })
    
    .get('/www-signup', (req, res) => res.render('signup'))
    .post('/signup', passport.authenticate("local-register", {
        successRedirect: "/",
        failureRedirect: "/signup"
    }))

    .get('/', loginRequired, (req, res) => {
        res.render('index')
    })

    .get('/trans', loginRequired, (req, res) => {
        let orignator = req.query.orignator,
            beneficiary = req.query.beneficiary,
            startDate = req.query.start_date,
            endDate = req.query.end_date;

        let q = `SELECT a.SESSIONID as SID, a.OriginatorAccountNumber, 
            a.BeneficiaryAccountNumber, trunc(RequestDate) as rdate 
            from nip_out_flw_2_v2 a, nip_failed_messages b
            WHERE 
                a.SESSIONID = b.SESSIONID
                AND a.ORIGINATORACCOUNTNUMBER='${orignator}'
                AND a.BENEFICIARYACCOUNTNUMBER ='${beneficiary}'
                AND a.requestdate between to_date('${startDate}','yyyy-mm-dd') 
                AND to_date('${endDate}','yyyy-mm-dd')`

            conex.raw(q)
                .then(data => res.render('result', {msg: data}))
                .catch(err => res.send(err))

    })

    .get('/search', loginRequired, (req, res) => {  
        let sid = req.query.search;

        if(sid > 0){
            let query2 = `select a.SESSIONID as SID,  
                    a.ORIGINATORACCOUNTNUMBER,
                    a.BENEFICIARYACCOUNTNUMBER, 
                    trunc(RequestDate) as rdate 
                    from nip_out_flw_2_v2 a, nip_failed_messages b
                    WHERE a.sessionid = b.sessionid AND a.sessionid = '${req.query.search}' `

                conex.raw(query2)
                    .then(message => {
                        res.render('result',{msg:message})
                    })
                    .catch(err => res.send(err))
                }
                else{
                //undefined: that means search box is empty; render everything
                    let setID = 0,
                        q = `select a.SESSIONID as SID,  
                        a.ORIGINATORACCOUNTNUMBER,
                        a.BENEFICIARYACCOUNTNUMBER, 
                        trunc(RequestDate) as rdate 
                        from nip_out_flw_2_v2 a, nip_failed_messages b
                        WHERE a.sessionid = b.sessionid AND a.sessionid = '${setID}' `
                
                        conex.raw(q)
                            .then(data => res.render('result', {msg: data}))
                            .catch(err => res.send(err))
                }   
    })

    //view details for a particular session id
    .get('/nip/:sid', loginRequired, (req, res) => {
        const sessionId = req.params.sid;
        let query = `SELECT a.SESSIONID as SID, 
                            a.OriginatorAccountNumber as Originator, 
                            a.BeneficiaryAccountNumber as Beneficiary, 
                            trunc(RequestDate) as Rdate,
                            b.MSG as MSG
                    from nip_out_flw_2_v2 a, nip_failed_messages b
                    where a.SESSIONID = '${sessionId}'`

        conex.raw(query).then((message)=>{
            res.render('resultdetails', {msg: message})
        }).catch(err => res.send(err))
    })


module.exports = router;