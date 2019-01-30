"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var morgan_1 = require("morgan");
var uuid = require('./lib/uuid');
var app = express_1.default();
var PORT = process.env.PORT || 5000;
var makeSVG = function (url) { return "\n<a href=\"" + url + "\" class=\"github-corner\" aria-label=\"View source on Github\">\n  <svg width=\"80\" height=\"80\" viewBox=\"0 0 250 250\" style=\"fill:#70B7FD; color:#fff; position: absolute; top: 0; border: 0; left: 0; transform: scale(-1, 1); z-index: 999\"\n    aria-hidden=\"true\">\n    <path d=\"M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z\"></path>\n    <path d=\"M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2\"\n      fill=\"currentColor\" style=\"transform-origin: 130px 106px;\" class=\"octo-arm\"></path>\n    <path d=\"M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z\"\n      fill=\"currentColor\" class=\"octo-body\"></path>\n  </svg>\n</a>\n<style>\n  .github-corner:hover .octo-arm {\n    animation: octocat-wave 560ms ease-in-out\n  }\n\n  @keyframes octocat-wave {\n    0%,\n    100% {\n      transform: rotate(0)\n    }\n    20%,\n    60% {\n      transform: rotate(-25deg)\n    }\n    40%,\n    80% {\n      transform: rotate(10deg)\n    }\n  }\n\n  @media (max-width:500px) {\n    .github-corner:hover .octo-arm {\n      animation: none\n    }\n    .github-corner .octo-arm {\n      animation: octocat-wave 560ms ease-in-out\n    }\n  }\n</style>\n"; };
/*
  Example implementation of a Netlify Addon Provider
  GET    /               # returns the manifest for the API (in development - not required yet)
  POST   /instances      # create a new instance of your microservice
  GET    /instances/:id  # get the current configuration of an instance
  PUT    /instances/:id  # update the configuration of an instance
  DELETE /instances/:id  # delete an instance
*/
// Load express middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(morgan_1.default('combined'));
/**
 * Required Provisioning Routes needed by Netlify
 */
// Manifest Route. Returns data about the integration
app.get('/', function (req, res) {
    res.status(200).send({ name: 'addon-viewsource' });
});
function useBody(body) {
    console.log('Create body', body);
    var config = body.config;
    console.log("Create " + body.service_id + " Instance for site " + config.site_url);
    /*
      CLI Command: `netlify addons:create express-example --name woooooo`
      The config `name: woooo` is user supplied via the CLI
    */
    var userConfig = config.config;
    console.log('Create userConfig', userConfig);
    if (!userConfig.repoURL)
        throw new Error('you must pass a repoURL flag to the viewsource addon');
    var scriptstring = makeSVG(userConfig.repoURL);
    // const logValue = userConfig.name || 'Express App';
    return { userConfig: userConfig, scriptstring: scriptstring };
}
// Create an instance of your Service for Netlify Site
app.post('/instances', function (req, res) {
    var body = req.body;
    var _a = useBody(body), userConfig = _a.userConfig, scriptstring = _a.scriptstring;
    // This ID will be used for all update/create/delete calls
    // example DELETE `/instances/${id}`
    var id = uuid();
    console.log("ID for subsequent Update/Get/Delete calls: " + id);
    var responseToNetlify = {
        id: id,
        config: userConfig,
        snippets: [
            {
                title: 'Netlify ViewSource Snippet',
                position: 'body',
                html: scriptstring
            }
        ]
    };
    // Create must return 201 response
    res.status(201).json(responseToNetlify);
});
// Get details on an instance of your Service for Netlify Site
app.get('/instances/:id', function (req, res) {
    var id = req.params.id;
    console.log("Get instanceId: " + id);
    console.log('Get body', req.body);
    /* Run logic to get information about instance */
    var body = req.body;
    var scriptstring = useBody(body).scriptstring;
    var instanceData = {
        snippets: [
            {
                title: 'Netlify ViewSource Snippet',
                position: 'body',
                html: scriptstring
            }
        ]
    };
    res.status(200).json(instanceData);
});
// Update details on an instance of your Service for Netlify Site
app.put('/instances/:id', function (req, res) {
    var id = req.params.id;
    console.log("Update instanceId: " + id);
    var body = req.body;
    var scriptstring = useBody(body).scriptstring;
    // Run Update logic to change values in your service
    // Return updated values to Netlify Site
    var responseToNetlify = {
        snippets: [
            {
                title: 'Netlify ViewSource Snippet',
                position: 'body',
                html: scriptstring
            }
        ]
    };
    res.status(200).json(responseToNetlify);
});
// Delete details on an instance of your Service for Netlify Site
app.delete('/instances/:id', function (req, res) {
    var id = req.params.id;
    console.log("Delete instanceId: " + id);
    console.log("Delete body", req.body);
    /* Run Deletion logic to remove the instance from your application */
    // Return any data you want back to Netlify cli
    var instanceInfo = {
        data: {
            lol: 'true'
        }
    };
    // Delete must return 204
    res.status(204).json(instanceInfo);
});
var server = app.listen(PORT, function () {
    var address = server.address();
    if (typeof address !== 'string') {
        console.log('Netlify ViewSource Addon Provisioning API running on port.', address.port);
    }
});
