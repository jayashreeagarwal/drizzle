const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded( { extended: true } ));
app.use(express.json());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs')

require('dotenv').config();

app.use(express.static('public'));
app.use(expressLayouts);

const routes = require('./server/routes/drizzleRoutes.js')
app.use('/', routes);


app.listen(port, () => console.log(`Listening to port ${port}`));