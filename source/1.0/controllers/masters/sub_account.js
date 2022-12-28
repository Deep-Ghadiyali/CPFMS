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
            req.flash('danger', 'Error while getting data from Master-Sub Account!');
            res.render('masters/sub_account/sub_account', {
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
            var sql1 = 'SELECT COUNT(*) as ahcount FROM `Sub_Account`';
            connection.query(sql1, (err, results) => {
                if (err) {
                    connection.release();
                    req.flash('danger', 'Error while getting count of Sub Account!');
                    console.log(err);
                    res.render('masters/sub_account/sub_account', {
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
                    var sql2 = "SET NAMES UTF8; SELECT * FROM `Sub_Account` LIMIT ? , ?";
                    var offset = (pagenum - 1) * entries_per_page;
                    connection.query(sql2, [offset, entries_per_page], (err, results) => {
                        connection.release();
                        if (err) {
                            req.flash('danger', 'Error while getting data from Master-Sub Account !');
                            console.log(err);
                            res.render('masters/sub_account/sub_account', {
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
                            res.render('masters/sub_account/sub_account', {
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

router.get('/search', middleware.loggedin_as_superuser, (req, res) => {
    getConnection((err, connection) => {
        if (err) {
            console.log(err);
            req.flash('danger', 'Error in searching Master-Sub Account!');
            res.redirect('/subaccount');
        }
        else {
            var ob = req.query;
            var searcht = '%' + ob['searchtext'].trim() + '%';
            var sql = "SET NAMES UTF8; SELECT * FROM Sub_Account";
            var flag = false;
            var arr = ['searchtext'];
            for (key in ob) {
                if (ob[key] !== "false" && key !== "searchtext") {
                    if (arr.includes(key)) {
                        if (!flag) {
                            flag = true;
                            sql = sql + " WHERE " + key + "='" + ob[key] + "'";
                        }
                        else
                            sql = sql + " AND " + key + "='" + ob[key] + "'";
                    }
                    else {
                        if (!flag) {
                            flag = true;
                            sql = sql + " WHERE " + ob[key] + " LIKE '" + searcht + "'";
                        }
                        else
                            sql = sql + " OR " + ob[key] + " LIKE '" + searcht + "'";
                    }
                }
            }
            connection.query(sql, (err, results) => {
                connection.release();
                if (err) {
                    console.log(err);
                    req.flash('danger', 'Error in searching Master-Sub Account with given parameters!');
                    res.redirect('/subaccount');
                }
                else {
                    res.render('masters/sub_account/sub_account_search', {
                        data: results[1],
                        searchtext: req.query.searchtext,
                        flash: res.locals.flash,
                        user_type: req.user.user_type
                    });
                }
            });
        }
    });
});

router.post('/', middleware.loggedin_as_superuser, (req, res) => {
    getConnection((err, connection) => {
        if (err) {
            req.flash('danger', 'Error in Adding Master-Sub Account!');
            console.log(err);
            res.redirect('/subaccount');
        }
        else {
            var { sub_account_id, sub_account_name, sub_account_name_guj, sub_account_address, sub_account_remark } = req.body;
            sub_account_id = sub_account_id.trim();
            var sql = 'SET NAMES UTF8; INSERT INTO `Sub_Account` (`sub_account_id`, `sub_account_name`, `sub_account_name_guj`, `sub_account_address`, `sub_account_remark`) VALUES (?, ?, ?, ?, ?)'
            connection.query(sql, [sub_account_id, sub_account_name, sub_account_name_guj, sub_account_address, sub_account_remark], (err, result) => {
                connection.release();
                if (err) {
                    console.log(err);
                    if (err.code == 'ER_DUP_ENTRY')
                        req.flash('danger', 'Sub Account with Sub A/c Id ' + sub_account_id + ' already exists!');
                    else
                        req.flash('danger', 'Error while adding sub account in Master-Sub Account!');
                    res.redirect('/subaccount');
                }
                else {
                    req.flash('success', 'Sub Account with Sub A/c Id ' + sub_account_id + ' added.');
                    res.redirect('/subaccount');
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
            res.redirect('/subaccount');
        }
        else {
            var { sub_account_id, sub_account_name, sub_account_name_guj, sub_account_address, sub_account_remark } = req.body;
            sub_account_id = sub_account_id.trim();
            var sql = "SET NAMES UTF8; UPDATE `Sub_Account` SET `sub_account_name` = ?, `sub_account_name_guj` = ?, `sub_account_address` = ?, `sub_account_remark` = ? WHERE `Sub_Account`.`sub_account_id` = ? ";
            connection.query(sql, [sub_account_name, sub_account_name_guj, sub_account_address, sub_account_remark, sub_account_id], (err, results) => {
                connection.release();
                if (err) {
                    req.flash('danger', 'Error while editing record with id ' + sub_account_id);
                    console.log(err);
                    res.redirect('/subaccount');
                }
                else {
                    req.flash('success', 'Successfully edited record with id ' + sub_account_id);
                    res.redirect('/subaccount');
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
            res.redirect('/subaccount');
        }
        else {
            var sql = "DELETE FROM `Sub_Account` WHERE sub_account_id IN (?)";
            connection.query(sql, [req.body.ids], (err, results) => {
                connection.release();
                if (err) {
                    req.flash('danger', 'Error while deleting the record!');
                    console.log(err);
                    res.redirect('/subaccount');
                }
                else {
                    if (results.affectedRows > 0) {
                        if (results.affectedRows === 1) {
                            req.flash('success', 'Successfully deleted record with id ' + req.body.ids[0]);
                        }
                        else {
                            req.flash('success', 'Successfully deleted selected records!');
                        }
                        res.redirect('/subaccount');
                    }
                    else {
                        req.flash('danger', 'Error while deleting the record!');
                        res.redirect('/subaccount');
                    }
                }
            });
        }
    });
});

module.exports = router;