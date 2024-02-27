const express = require('express');
const path = require('path');
const stocks = require('./stocks');
const cors = require('cors'); 

const app = express();

// adding middleware to serve static files and enable CORS
app.use(express.static(path.join(__dirname, 'static')));
app.use(cors());

// endpoint to get the list of available stocks
app.get('/stocks', async (req, res, next) => {
  try {
    const stockSymbols = await stocks.getStocks();
    if (stockSymbols.length === 0) {
      res.status(404).json({ error: 'Data not found! Please check the stocks data file.' });
    } else {
      res.json({ stockSymbols });
    }
  } catch (err) {
    next(err); 
  }
});

// endpoint to get data for a specific stock
app.get('/stocks/:symbol', async (req, res, next) => {
  try {
    const { params: { symbol } } = req;
    const data = await stocks.getStockPoints(symbol, new Date());
    res.json(data);
  } catch (err) {
    next(err); 
  }
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// starting the server
app.listen(3000, () => console.log('Server is running!'));