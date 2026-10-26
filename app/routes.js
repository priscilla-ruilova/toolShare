const Tool = require('./models/tool.js');
module.exports = function(app, passport, db, ObjectID) {

// LOGIN SECTION =========================
    app.get('/', function(req, res) {
      res.render('index.ejs')
    });
// SHOW HOME PAGE (will also have our login links) ================
    app.get('/profile', async function(req, res) {
      try {
        const tools = await Tool.find({}); //this is to find ERRthing in the database
        res.status(200).render('profile.ejs', { 
          user: req.user,
          tools: tools, error: undefined });
      } catch (error) {
        res.status(500).json({ message: error.message })
    };
    });
//// SHOWS ONE PARTICULAR TOOL IN THE DATABASE =========================
    app.get('/tool/:id', async function(req, res) {
      try {
        const { id } = req.params;
        const tool = await Tool.findOne({ _id: new ObjectID(id) }); //this is to find all things in the database
        console.log(tool, "help!")
        res.status(200).render('tool.ejs', { 
          user: req.user,
          tool});
      } catch (error) {
        res.status(500).json({ message: error.message })
    };
    });

//// CREATES A NEW TOOL =================================
    app.post('/tools', async function(req, res) {
      try {
        const tool = await Tool.create(
          { ...req.body, lender: req?.user?.local?.name }
        ); //we are creating an instance for this aka an object!
        console.log(tool);
        res.redirect('/profile');
      } catch (error) {
        
        res.status(500).json({ message: error.message }); //this means server error and we'll throw the error out of json.
    }
    })
// LOGOUT PROCESS ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

//// UPDATING A TOOL LIBRARY ITEM'S BORROWER =================================

    app.put('/tool/:id', (req, res) => {
      console.log(req.body)
      console.log(req.body.borrower)
      db.collection('tools')
      .findOneAndUpdate({_id: new ObjectID(req.body.toolId)}, {
        $set: { //this is a mongodb operator that acts on a 'field' (aka the Key)
          borrower: (req.body.borrower),
          returnDate: (req.body.returnDate)
        }
      }, (err, result) => {
          console.log(err)
        if (err) return res.send(err)
        res.send(result)
      })
    })
/// UPDATING A TOOL LIBRARY ITEM'S RETURN DATE=================================


//// DELETING A TOOL FROM LIBRARY  ===============================================================

    app.delete('/tool', (req, res) => {
      db.collection('tools').findOneAndDelete({_id: new ObjectID(req.body.toolId)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Tool deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}










