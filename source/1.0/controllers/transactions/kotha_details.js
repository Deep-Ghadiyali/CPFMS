const express = require("express");
const router = express.Router();
const getConnection = require("../../connection");
const middleware = require("../auth/auth_middleware");

router.get("/", middleware.loggedin_as_superuser, (req, res) => {
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
			req.flash(
				"danger",
				"Error while getting data from Kotha Details!"
			);
			res.render("transactions/kotha_details/kotha_details", {
				data: [],
				totalpages: 0,
				pagenum: 0,
				entries_per_page,
				totalentries: 0,
				flash: res.locals.flash,
				user_type: req.user.user_type,
			});
		}
		else {
			var sql1 = "SELECT COUNT(DISTINCT account_id,sub_account_id) as ahcount FROM `Kotha_Details`";
			connection.query(sql1, (err, results) => {
				if (err) {
					connection.release();
					req.flash("danger", "Error while getting count of Kotha_Details!");
					console.log(err);
					res.render("transactions/kotha_details/kotha_details", {
						data: [],
						totalpages: 0,
						pagenum: 0,
						entries_per_page,
						totalentries: 0,
						flash: res.locals.flash,
						user_type: req.user.user_type,
					});
				} else {
					totalentries = results[0].ahcount;
					totalpages = Math.ceil(totalentries / entries_per_page);
					if (pagenum > totalpages) {
						pagenum = totalpages;
					} else if (pagenum <= 0) {
						pagenum = 1;
					}
					var sql2 = `
						SET NAMES UTF8;
						SELECT 
							a.account_id, a.sub_account_id, COUNT(a.entry_id) AS total_entry,
							b.account_name,
							c.sub_account_name
						FROM Kotha_Details a, Account_Head b, Sub_Account c
						WHERE a.account_id = b.account_id AND a.sub_account_id = c.sub_account_id
						GROUP BY account_id, sub_account_id
                    	LIMIT ? , ?;
                    `;
					var offset = (pagenum - 1) * entries_per_page;
					connection.query(sql2, [offset, entries_per_page], (err, results) => {
						connection.release();
						if (err) {
							req.flash(
								"danger",
								"Error while getting data from Master-Account Balance!"
							);
							console.log(err);
							res.render("transactions/kotha_details/kotha_details", {
								data: [],
								totalpages: 0,
								pagenum: 0,
								entries_per_page,
								totalentries: 0,
								flash: res.locals.flash,
								user_type: req.user.user_type,
							});
						} else {
							res.render("transactions/kotha_details/kotha_details", {
								data: results[1],
								totalpages,
								pagenum,
								entries_per_page,
								totalentries,
								flash: res.locals.flash,
								user_type: req.user.user_type,
							});
						}
					});
				}
			});
		}
	});
});

router.get("/search", middleware.loggedin_as_superuser, (req, res) => {
	var entries_per_page, pagenum, totalentries, totalpages;
	if (!req.query.entries_per_page)
		entries_per_page = 25;
	else
		entries_per_page = parseInt(req.query.entries_per_page);
	if (!req.query.pagenum)
		pagenum = 1;
	else
		pagenum = parseInt(req.query.pagenum);
	getConnection((err, connection) => {
		if (err) {
			console.log(err);
			req.flash("danger", "Error in searching Kotha Details!");
			res.redirect("/kotha-details");
		}
		else {
			var sql = `
				SET NAMES UTF8;
				SELECT SQL_CALC_FOUND_ROWS
					a.account_id,a.sub_account_id,COUNT(a.entry_id) AS total_entry,
					b.account_name,
					c.sub_account_name
				FROM
					Kotha_Details a, Account_Head b, Sub_Account c
				WHERE
					(a.account_id = b.account_id AND a.sub_account_id = c.sub_account_id)
			`;
			var ob = req.query;
			var searcht = "%" + ob["searchtext"].trim() + "%";
			var flag = false;
			if (ob.hasOwnProperty("account_name")) {
				if (!flag) {
					flag = true;
					sql = sql + " AND (b.account_name LIKE " + connection.escape(searcht);
				}
				else
					sql = sql + " OR b.account_name LIKE " + connection.escape(searcht);
			}
			if (ob.hasOwnProperty("sub_account_name")) {
				if (!flag) {
					flag = true;
					sql = sql + " AND (c.sub_account_name LIKE '" + searcht + "'";
				}
				else
					sql = sql + " OR c.sub_account_name LIKE '" + searcht + "'";
			}
			if (ob["account_id"]) {
				if (!flag) {
					flag = true;
					sql = sql + " AND (a.account_id =" + connection.escape(ob["account_id"]);
				}
				else
					sql = sql + " OR a.account_id =" + connection.escape(ob["account_id"]);
			}
			if (ob["sub_account_id"]) {
				if (!flag) {
					flag = true;
					sql = sql + " AND (a.sub_account_id =" + connection.escape(ob["sub_account_id"]);
				}
				else
					sql = sql + " OR a.sub_account_id =" + connection.escape(ob["sub_account_id"]);
			}
			if(flag)
				sql = sql + ")";
			sql = sql + " LIMIT ?,?; SELECT FOUND_ROWS() AS count;";
			var offset = (pagenum - 1) * entries_per_page;
			if (offset < 0)
				offset = 0;
			connection.query(sql, [offset, entries_per_page], (err, results) => {
				connection.release();
				if (err) {
					console.log(err);
					req.flash("danger", "Error in searching Kotha Details!");
					res.redirect("/kotha-details");
				}
				else {
					totalentries = parseInt(results[2][0].count);
					totalpages = Math.ceil(totalentries / entries_per_page);
					if (pagenum > totalpages) {
						pagenum = totalpages;
					}
					else if (pagenum <= 0) {
						pagenum = 1;
					}
					var callbackurlarr = req.originalUrl.split('?')[1].split('&');
					var newarr = [];
					for (part of callbackurlarr) {
						if (part.includes('searchtext') || part.includes('account_name') || part.includes('sub_account_name') || part.includes('account_id') || part.includes('sub_account_id')) {
							newarr.push(part);
						}
					}
					var callbackurl = newarr.join('&');
					var searched = (req.query.searchtext ? req.query.searchtext : "-") + "," + (req.query.account_id ? req.query.account_id : "-") + "," + (req.query.sub_account_id ? req.query.sub_account_id : "-");
					res.render("transactions/kotha_details/kotha_details_search", {
						data: results[1],
						searchtext: searched,
						totalpages,
						pagenum,
						entries_per_page,
						totalentries,
						flash: res.locals.flash,
						user_type: req.user.user_type,
						callbackurl
					});
				}
			});
		}
	});
});

router.get("/add", middleware.loggedin_as_superuser, (req, res) => {
	getConnection((err, connection) => {
		if (err) {
			console.log(err);
			req.flash("danger", "Error while adding new entry!");
			res.redirect("/kotha-details");
		} else {
			var sql = `
				SET NAMES UTF8;
                SELECT * FROM Account_Head WHERE is_society=1;
				SELECT item1,item2,item3,item4 FROM Kotha_Master ORDER BY month_id;
            `;
			connection.query(sql, (err, results) => {
				connection.release();
				if (err) {
					console.log(err);
					req.flash("danger", "Error while adding new entry!");
					res.redirect("/kotha-details");
				} else {
					res.render("transactions/kotha_details/addform", {
						account_head: results[1],
						data: results[2]
					});
				}
			});
		}
	});
});

router.post("/", middleware.loggedin_as_superuser, (req, res) => {
	getConnection((err, connection) => {
		if (err) {
			req.flash("danger", "Error in Adding Kotha Details Entry!");
			console.log(err);
			res.redirect("/kotha-details");
		} else {
			var { account_id, sub_account_id, issue_date, change_issue_date, item1s, item2s, item3s, item4s} = req.body;
			if (item1s.length != item2s.length || item2s.length != item3s.length || item3s.length != item4s.length) {
				console.log("Array Count Mismatch!");
				req.flash("danger", "Error while adding new entry!");
				res.redirect("/kotha-details");
			}
			else {
				var sql = '';
				var insert_sql = 'SET NAMES UTF8; INSERT INTO Kotha_Details VALUES';
				var insert_sql_instance = '';
				var sql_arr = [];
				var i, item1, item2, item3, item4;
				for(i = 0; i<item1s.length; i++) {
					item1 = item1s[i];
					item2 = item2s[i];
					item3 = item3s[i];
					item4 = item4s[i];
					if (i==0)
						insert_sql_instance = ` (${connection.escape(account_id)}, ${connection.escape(sub_account_id)}, ${i+1}, ${connection.escape(item1)}, ${connection.escape(item2)}, ${connection.escape(item3)}, ${connection.escape(item4)})`;
					else
						insert_sql_instance = `, (${connection.escape(account_id)}, ${connection.escape(sub_account_id)}, ${i+1}, ${connection.escape(item1)}, ${connection.escape(item2)}, ${connection.escape(item3)}, ${connection.escape(item4)})`;
					insert_sql += insert_sql_instance;						
				}
				insert_sql += ";"
				if(change_issue_date == 'on') {
					sql_arr = [issue_date, account_id, sub_account_id];
					sql = insert_sql + `
						UPDATE Account_Balance
							SET issue_date = ?
						WHERE account_id = ? AND sub_account_id IN (?); 
					`;
				}
				else {
					sql_arr = [];
					sql = insert_sql;
				}	
				connection.query(sql, sql_arr, (err, result) => {
					connection.release();
					if (err) {
						console.log(err);
						if (err.code == "ER_DUP_ENTRY")
							req.flash(
								"danger",
								"Kotha Details Entry for Member with Member Id " +
								sub_account_id +
								" with Society " +
								account_id +
								" already exists!"
							);
						else
							req.flash(
								"danger",
								"Error while adding account in Kotha Details!"
							);
						res.redirect("/kotha-details");
					}
					else {
						req.flash(
							"success",
							"Kotha Details Entry for Member with Member Id " +
							sub_account_id +
							" with Society " +
							account_id +
							" added!"
						);
						res.redirect("/kotha-details");
					}
				});
			}
		}
	});
});

router.get("/edit/:accountid/:subaccountid", middleware.loggedin_as_admin, (req, res) => {
	var account_id = req.params.accountid.trim();
	var sub_account_id = req.params.subaccountid.trim();
	getConnection((err, connection) => {
		if (err) {
			console.log(err);
			req.flash("danger", "Error while editing entry!");
			res.redirect("/kotha-details");
		} else {
			var sql_arr = [account_id, sub_account_id, account_id, sub_account_id, account_id, sub_account_id];
			var sql = `
				SET NAMES UTF8;
				SELECT item1,item2,item3,item4 FROM Kotha_Details WHERE account_id = ? AND sub_account_id = ? ORDER BY entry_id ASC;
				SELECT account_name FROM Account_Head WHERE account_id = ?;
				SELECT sub_account_name FROM Sub_Account WHERE sub_account_id = ?;
				SELECT DATE_FORMAT(issue_date,'%Y-%m-%d') AS issue_date FROM Account_Balance WHERE account_id = ? AND sub_account_id = ?;
            `;
			connection.query(sql, sql_arr, (err, results) => {
				connection.release();
				if (err) {
					console.log(err);
					req.flash("danger", "Error while editing entry!");
					res.redirect("/kotha-details");
				} else {
					var account_name = results[2][0].account_name;
					var sub_account_name = results[3][0].sub_account_name;
					var issue_date = results[4][0].issue_date;
					res.render("transactions/kotha_details/editform", {
						data: results[1],
						account_id,
						sub_account_id,
						account_name,
						sub_account_name,
						issue_date
					});
				}
			});
		}
	});
});

router.post("/edit", middleware.loggedin_as_admin, (req, res) => {
	getConnection((err, connection) => {
		if (err) {
			req.flash("danger", "Error in Editing Kotha Details Entry!");
			console.log(err);
			res.redirect("/kotha-details");
		} else {
			var { account_id, sub_account_id, issue_date, change_issue_date, item1s, item2s, item3s, item4s} = req.body;
			if (item1s.length != item2s.length || item2s.length != item3s.length || item3s.length != item4s.length || item1s.length <= 0) {
				console.log("Array Count Mismatch!");
				req.flash("danger", "Error while enditing entry!");
				res.redirect("/kotha-details");
			}
			else {
				var sql = '';
				var insert_sql = 'SET NAMES UTF8; DELETE FROM Kotha_Details WHERE account_id = ? AND sub_account_id = ?; INSERT INTO Kotha_Details VALUES';
				var insert_sql_instance = '';
				var sql_arr = [];
				var i, item1, item2, item3, item4;
				for(i = 0; i<item1s.length; i++) {
					item1 = item1s[i];
					item2 = item2s[i];
					item3 = item3s[i];
					item4 = item4s[i];
					if (i==0)
						insert_sql_instance = ` (${connection.escape(account_id)}, ${connection.escape(sub_account_id)}, ${i+1}, ${connection.escape(item1)}, ${connection.escape(item2)}, ${connection.escape(item3)}, ${connection.escape(item4)})`;
					else
						insert_sql_instance = `, (${connection.escape(account_id)}, ${connection.escape(sub_account_id)}, ${i+1}, ${connection.escape(item1)}, ${connection.escape(item2)}, ${connection.escape(item3)}, ${connection.escape(item4)})`;
					insert_sql += insert_sql_instance;						
				}
				insert_sql += ";"
				if(change_issue_date == 'on') {
					sql_arr = [account_id, sub_account_id, issue_date, account_id, sub_account_id];
					sql = insert_sql + `
						UPDATE Account_Balance
							SET issue_date = ?
						WHERE account_id = ? AND sub_account_id IN (?); 
					`;
				}
				else {
					sql_arr = [account_id, sub_account_id];
					sql = insert_sql;
				}	
				connection.query(sql, sql_arr, (err, result) => {
					connection.release();
					if (err) {
						console.log(err);
						req.flash(
							"danger",
							"Error while editing account in Kotha Details!"
						);
						res.redirect("/kotha-details");
					}
					else {
						req.flash(
							"success",
							"Kotha Details Entry for Member with Member Id " +
							sub_account_id +
							" with Society " +
							account_id +
							" edited!"
						);
						res.redirect("/kotha-details");
					}
				});
			}
		}
	});
});

router.post("/delete", middleware.loggedin_as_admin, (req, res) => {
	getConnection((err, connection) => {
		if (err) {
			console.log(err);
			req.flash("danger", "Error while deleting the record!");
			res.redirect("/kotha-details");
		} else {
			var sql = "";
			for (var i = 0; i < req.body.account_ids.length; ++i) {
				sql =
					sql +
					"DELETE FROM Kotha_Details WHERE account_id=" +
					connection.escape(req.body.account_ids[i]) +
					" AND sub_account_id=" +
					connection.escape(req.body.sub_account_ids[i]) +
					";";
			}
			connection.query(sql, (err, results) => {
				connection.release();
				if (err) {
					req.flash("danger", "Error while deleting the record!");
					console.log("Error : ",err);
					res.redirect("/kotha-details");
				} else {
					var count = 0;
					if (req.body.sub_account_ids.length <= 1) {
						if (results.affectedRows > 0) {
							req.flash("success", "Successfully deleted Kotha Details entries of member with society id " + req.body.account_ids[0] + " and member id " + req.body.sub_account_ids[0] + " !");
						}
						else {
							req.flash("danger", "Error while deleting Kotha Details entries of member with society id " + req.body.account_ids[0] + " and member id " + req.body.sub_account_ids[0] + " !");
						}
					}
					else {
						for (result of results) {
							if (result.affectedRows >= 1) {
								req.flash("success", "Successfully deleted Kotha Details entries of member with society id " + req.body.account_ids[count] + " and member id " + req.body.sub_account_ids[count] + " !");
							} else {
								req.flash("danger", "Error while deleting Kotha Details entries of member with society id " + req.body.account_ids[count] + " and member id " + req.body.sub_account_ids[count] + " !");
							}
							count++;
						}
					}
					res.redirect("/kotha-details");
				}
			});
		}
	});
});

module.exports = router;
