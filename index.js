const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('./lib/uuid');
const app = express();
const PORT = process.env.PORT || 5000;

const makeSVG = url => `
<a href="${url}" class="github-corner" aria-label="View source on Github">
  <svg width="80" height="80" viewBox="0 0 250 250" style="fill:#70B7FD; color:#fff; position: absolute; top: 0; border: 0; left: 0; transform: scale(-1, 1); z-index: 999"
    aria-hidden="true">
    <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
    <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
      fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
    <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
      fill="currentColor" class="octo-body"></path>
  </svg>
</a>
<style>
  .github-corner:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out
  }

  @keyframes octocat-wave {
    0%,
    100% {
      transform: rotate(0)
    }
    20%,
    60% {
      transform: rotate(-25deg)
    }
    40%,
    80% {
      transform: rotate(10deg)
    }
  }

  @media (max-width:500px) {
    .github-corner:hover .octo-arm {
      animation: none
    }
    .github-corner .octo-arm {
      animation: octocat-wave 560ms ease-in-out
    }
  }
</style>
`;

/*
  Example implementation of a Netlify Addon Provider
  GET    /               # returns the manifest for the API (in development - not required yet)
  POST   /instances      # create a new instance of your microservice
  GET    /instances/:id  # get the current configuration of an instance
  PUT    /instances/:id  # update the configuration of an instance
  DELETE /instances/:id  # delete an instance
*/

// Load express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));

/**
 * Required Provisioning Routes needed by Netlify
 */

// Manifest Route. Returns data about the integration
app.get('/', function(req, res) {
  res.status(200).send({ name: 'addon-viewsource' });
});

// Create an instance of your Service for Netlify Site
app.post('/instances', function(req, res) {
  const body = req.body;
  console.log('Create body', body);
  const config = body.config;
  console.log(`Create ${body.service_id} Instance for site ${config.site_url}`);

  /*
    CLI Command: `netlify addons:create express-example --name woooooo`
    The config `name: woooo` is user supplied via the CLI
  */

  const userConfig = config.config;
  console.log('Create userConfig', userConfig);
  /* Do provisioning logic here */
  if (!userConfig.repoURL)
    throw new Error('you must pass a repoURL flag to the viewsource addon');

  const logValue = userConfig.name || 'Express App';

  // This ID will be used for all update/create/delete calls
  // example DELETE `/instances/${id}`
  const id = uuid();
  console.log(`ID for subsequent Update/Get/Delete calls: ${id}`);

  const responseToNetlify = {
    id: id,
    config: config.config,
    snippets: [
      {
        title: 'Netlify ViewSource Snippet',
        position: 'body',
        html: makeSVG(userConfig.repoURL)
      }
    ]
  };
  // Create must return 201 response
  res.status(201).json(responseToNetlify);
});

// Get details on an instance of your Service for Netlify Site
app.get('/instances/:id', function(req, res) {
  const id = req.params.id;
  console.log(`Get instanceId: ${id}`);
  console.log('Get body', req.body);
  /* Run logic to get information about instance */

  // const instanceData = fetchDataFromDatabase(id)

  const instanceData = {
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
app.put('/instances/:id', function(req, res) {
  const id = req.params.id;
  console.log(`Update instanceId: ${id}`);
  const body = req.body;
  console.log('Update body', body);
  const config = body.config;
  console.log('Update config', config);

  // Run Update logic to change values in your service

  const logValue = config.name || 'Express App';

  // Return updated values to Netlify Site
  const responseToNetlify = {
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
app.delete('/instances/:id', function(req, res) {
  const id = req.params.id;
  console.log(`Delete instanceId: ${id}`);
  console.log(`Delete body`, req.body);
  /* Run Deletion logic to remove the instance from your application */

  // Return any data you want back to Netlify cli
  const instanceInfo = {
    data: {
      lol: 'true'
    }
  };

  // Delete must return 204
  res.status(204).json(instanceInfo);
});

const server = app.listen(PORT, function() {
  console.log(
    'Netlify ViewSource Addon Provisioning API running on port.',
    server.address().port
  );
});
