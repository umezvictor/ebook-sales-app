const express = require('express');
//stripe publishable key  pk_test_GkN16XrK5RAuAzEyPwlnXTT1
const stripe = require('stripe')('sk_test_rrFijxAxFt4XIr5mtqn6mxBa');//because stripe was installed via npm
const bodyParser = require('body-parser');//for pasing data
const exphbs = require('express-handlebars');//template engine

const app = express();

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//set static folder
app.use(express.static(`${__dirname}/public`));//could be done with path  module  as well


//index page
app.get('/', (req, res) => {
    res.render('index');
});

//success page route
// app.get('/success', (req, res) => {
//     res.render('success');
// });

//charge  route
//read https://www.npmjs.com/package/stripe

//haandles post request, when submit button is clicked
app.post('/charge', (req, res) => {
    //create the amount
    const amount = 2500;
    //create a customer--returns a promise
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        //charge customer
        amount,
        description:'cooking ebook',
        currency:'usd',
        customer:customer.id //the object given bystripe after submit has a property called id
    }))
    .then(charge => res.render('success')); //display success page
    /*
    use this to see what the form sends when submitted

    console.log(req.body);//how to get data with body parser
    res.send('test'); //render on page

    below is what is shown in the console

    { stripeToken: 'tok_1DqH6rAS1iVp88yhXe3oVFq6',
  stripeTokenType: 'card',
  stripeEmail: 'victorblaze2010@gmail.com' }

    */
});
const port = process.env.PORT || 5000;  //app will select port automatically based on environment, development or production

//start server
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});