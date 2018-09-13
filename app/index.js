const cors = require('cors');
const connect = require('connect');
const jsonParser = require('body-parser').json;
const jayson = require('jayson');

let routes = require('./routes');
let server = jayson.server(routes);
let app = connect();

app.use(cors({
    methods: ['POST']
}));
app.use(jsonParser());
app.use(server.middleware());

app.listen(3000);
console.log('APP listening 3000\n\r');
