const express = require('express');
const router = express.Router();
const getConnection = require('../../connection');
const middleware = require('../auth/auth_middleware');

router.get('/', middleware.loggedin_as_superuser, (req, res) => {
    var entries_per_page, pagenum, totalentries, totalpages;
    if (!req.query.entries_per_page)
        entries_per_page = 25;
    else
        entries_per_page = parseInt(req.query.entries_per_page);
    if (!req.query.pagenum)
        pagenum = 1;
    else
        pagenum = parseInt(req.query.pagenum);
    if (entries_per_page !== 25 && entries_per_page !== 50 && entries_per_page !== 100)
        entries_per_page = 25;
    getConnection((err, connection) => {
        if (err) {
            console.log(err);
            req.flash('danger', 'Error while getting data from Master-Kotha!');
            res.render('masters/kotha_master/kotha_master', {
                data: [],
                totalpages: 0,
                pagenum: 0,
                entries_per_page,
                totalentries: 0,
                flash: res.locals.flash,
                user_type: req.user.user_type
            });
        }
        else {
            var sql1 = 'SELECT COUNT(*) as ahcount FROM `Kotha_Master`';
            connection.query(sql1, (err, results) => {
                if (err) {
                    connection.release();
                    req.flash('danger', 'Error while getting count of Kotha Master!');
                    console.log(err);
                    res.render('masters/kotha_master/kotha_master', {
                        data: [],
                        totalpages: 0,
                        pagenum: 0,
                        entries_per_page,
                        totalentries: 0,
                        flash: res.locals.flash,
                        user_type: req.user.user_type
                    });
                }
                else {
                    totalentries = results[0].ahcount;
                    totalpages = Math.ceil(totalentries / entries_per_page);
                    if (pagenum > totalpages) {
                        pagenum = totalpages;
                    }
                    else if (pagenum <= 0) {
                        pagenum = 1;
                    }
                    var sql2 = "SET NAMES UTF8; SELECT * FROM `Kotha_Master` LIMIT ? , ?";
                    var offset = (pagenum - 1) * entries_per_page;
                    if(totalentries == 0) {
                        offset = 0;
                    }
                    connection.query(sql2, [offset, entries_per_page], (err, results) => {
                        connection.release();
                        if (err) {
                            req.flash('danger', 'Error while getting data from Master-Kotha!');
                            console.log(err);
                            res.render('masters/kotha_master/kotha_master', {
                                data: [],
                                totalpages: 0,
                                pagenum: 0,
                                entries_per_page,
                                totalentries: 0,
                                flash: res.locals.flash,
                                user_type: req.user.user_type
                            });
                        }
                        else {
                            res.render('masters/kotha_master/kotha_master', {
                                data: results[1],
                                totalpages,
                                pagenum,
                                entries_per_page,
                                totalentries,
                                flash: res.locals.flash,
                                user_type: req.user.user_type
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post('/', middleware.loggedin_as_superuser, (req, res) => {
    getConnection((err, connection) => {
        if (err) {
            req.flash('danger', 'Error in Adding Master-Cow Cast!');
            console.log(err);
            res.redirect('/kotha_master');
        }
        else {
            var { month_id, item1, item2, item3, item4 } = req.body;
            month_id = month_id.trim();
            var sql = 'SET NAMES UTF8; INSERT INTO `Kotha_Master` (`month_id`, `item1`, `item2`, `item3`, `item4`) VALUES (?, ?, ?, ?, ?)';
            connection.query(sql, [month_id, item1, item2, item3, item4],
                (err, result) => {  
                    connection.release();
                    if (err) {
                        console.log(err);
                        if (err.code == 'ER_DUP_ENTRY')
                            req.flash('danger', 'Kotha Item with Month Id ' + month_id + ' already exists!');
                        else
                            req.flash('danger', 'Error while adding in Master-Kotha!');
                        res.redirect('/kotha_master');
                    }
                    else {
                        req.flash('success', 'Kotha Master with Month Id ' + month_id + ' Added.');
                        res.redirect('/kotha_master');
                    }
                });
        }
    });
});

router.post('/edit', middleware.loggedin_as_admin, (req, res) => {
    getConnection((err, connection) => {
        if (err) {
            console.log(err);
            req.flash('danger', 'Error while editing record !');
            res.redirect('/kotha_master');
        }
        else {
            var { month_id, item1, item2, item3, item4 } = req.body;
            month_id = month_id.trim();
            var sql = "SET NAMES UTF8; UPDATE `Kotha_Master` SET `item1` = ?, `item2` = ?, `item3` = ?, `item4` = ? WHERE `Kotha_Master`.`month_id` = ? ";
            connection.query(sql, [item1, item2, item3, item4, month_id], (err, results) => {
                connection.release();
                if (err) {
                    req.flash('danger', 'Error while editing record with id ' + month_id);
                    console.log(err);
                    res.redirect('/kotha_master');
                }
                else {
                    req.flash('success', 'Successfully edited record with id ' + month_id);
                    res.redirect('/kotha_master');
                }
            });
        }
    })
});

router.post('/delete', middleware.loggedin_as_admin, (req, res) => {
    getConnection((err, connection) => {
        if (err) {
            console.log(err);
            req.flash('danger', 'Error while deleting the record!');
            res.redirect('/kotha_master');
        }
        else {
            var sql = "DELETE FROM `Kotha_Master` WHERE month_id IN (?)";
            connection.query(sql, [req.body.ids], (err, results) => {
                connection.release();
                if (err) {
                    req.flash('danger', 'Error while deleting the record!');
                    console.log(err);
                    res.redirect('/kotha_master');
                }
                else {
                    if (results.affectedRows === 0) {
                        req.flash('danger', 'Error while deleting the record!');
                    }
                    else if (req.body.ids.length === 1) {
                        req.flash('success', 'Successfully deleted record with id ' + req.body.ids[0]);
                    }
                    else {
                        req.flash('success', 'Successfully deleted selected records!');
                    }
                    res.redirect('/kotha_master');
                }
            });
        }
    });
});

module.exports = router;