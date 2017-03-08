var auth = require('./auth');
var path = require('path'),
    util = require('util'),
    fs = require('fs'),
    BoxSDK = require('box-node-sdk'),
    sdk = new BoxSDK({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        appAuth: {
			keyID: process.env.PUBLIC_KEY_ID,
			privateKey: fs.readFileSync(path.resolve(__dirname, process.env.PRIVATE_KEY_PATH)),
			passphrase: process.env.PRIVATE_KEY_PASSPHRASE
		}
    });
    
module.exports = function(app) {
    
    app.post('/login/callback', auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }), function (req, res) {
        res.redirect('/');
    });

    app.get('/login', auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }), function (req, res) {
        res.redirect('/');
    });
    app.get('/logout', function (req, res){
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });

    // MUST BE AFTER /login /post urls or else it will be endless redirects =========
    app.use(auth.protected);
    // MIDDLEWARE ==================== 
    app.use(auth.protected, function(req,res,next) {
        userAPIClient = sdk.getAppAuthClient('user', req.session.passport.user);
        next();
    });

    app.get('/', auth.protected, function (req, res){
          res.redirect('/home');
    });

    app.get('/api/folder/:id', auth.protected, function(req,res) {
        var id = req.params.id;
        userAPIClient.folders.getItems(
            id, 
            {
                fields: 'name,modified_at,modified_by,created_at,created_by,size,url,permissions,sync_state',
                offset: 0,
                limit: 25
            },function(err,data) {
                if(err) {
                    res.json({
                        error: err,
                        errorDetails: util.inspect(err)
                    })
                    return;
                }
                res.json({
                    files: data ? data.entries: []
                });
            }
        );
    });
    
    app.get('/api/user', auth.protected, function(req,res) {
        userAPIClient.users.get(userAPIClient.CURRENT_USER_ID, null, function(err,data) {
                if(err) {
                    res.json({
                        error: err,
                        errorDetails: util.inspect(err)
                    })
                    return;
                }
                res.json({
                    user: data
                });
            }
        );
    });
    
    // for security concerns - will need to block routes to /api/ here *********

    app.get('*',function(req,res) {
        res.sendFile(path.join(__dirname,'../public/views/index.html')); 
    });
}