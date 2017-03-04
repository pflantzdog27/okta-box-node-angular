var auth = require('./auth');
var path = require('path'),
    util = require('util'),
    BoxSDK = require('box-node-sdk'),
    sdk = new BoxSDK({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        appAuth: {
			keyID: process.env.PUBLIC_KEY_ID,
			privateKey: fs.readFileSync(path.resolve(__dirname, process.env.PRIVATE_KEY_PATH)),
			passphrase: process.env.PRIVATE_KEY_PASSPHRASE
		}
    }),
    //adminAPIClient = sdk.getAppAuthClient('enterprise', process.env.ENTERPRISE_ID);
    devToken = 'Vm0B2KLlWI0dGbgSy5eTYl9HC1TgkXwI';


module.exports = function(app) {

    // MIDDLEWARE ==================== 
    app.use(function(req,res,next) {
        //create a basic API client -- ultimately this needs to be updated to use a persistent client but I can't figure that out yet
        req.sdk = sdk.getBasicClient(devToken);
        next();
    });
    
    app.post('/login/callback', auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }), function (req, res) {
        res.redirect('/home');
    });

    app.get('/login', auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }), function (req, res) {
        res.redirect('/home');
    });

    //required to be after /login /post urls or else it will be endless redirects
    app.use(auth.protected);

    app.get('/', auth.protected, function (req, res){
          res.end("Hello " + req.session.passport.user);
    });

    app.get('/api/folder/:id', auth.protected, function(req,res) {
        var id = req.params.id;
        req.sdk.folders.getItems(
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

    app.get('*',function(req,res) {
        res.sendFile(path.join(__dirname,'../public/views/index.html')); 
    });
}