import React, {useState, useEffect} from 'react';
import {Container, Paper, Stack, Button,  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, DialogActions, Dialog, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import axios from 'axios';
import controllers from '../../backend/controllers/index.js'

//consider just using a single execute order button
const CryptoBuySellTemp = ({ props, coin, user, setUser, guest }) => {
  const [buyAmt, setBuyAmt] = useState('');
  const [sellAmt, setSellAmt] = useState('');
  const [price, setPrice] = useState('');
  const [open, setOpen] = useState(false);
  const [trade, setTrade] = useState('')

  useEffect(() => {
    let updatePrice = () => {
      axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${coin[0]}&tsyms=USD`)
        .then((result) => {
          console.log('This is what the buy click gets for current value ', result.data.USD)
          setPrice(result.data.USD)
        }
      )
    }
    updatePrice()
    let intervalId = setInterval(updatePrice, 10000);
    return () => clearInterval(intervalId)
    },
  [coin])

  const updating = (form) => {
      setUser(form);
      console.log('this is form', form.id)
      // console.log('this is form id', form.id)
     controllers.updateUser(form.id, form);
    }

  const handleBuy = (e) => {
    setBuyAmt(e.target.value)
  }
  const handleSell = (e) => [
    setSellAmt(e.target.value)
  ]

  const handleBuyClick = () => {
    if((buyAmt * price) > user.availableCash) {
      console.log("Sorry, you don't seem to have enough funds for this trade at this time")
    } else {
      // setUser and update DB
      let currentCoinIdx = null;
      let currentCoin = null;
      let newBalance = user.availableCash - (buyAmt * price)
      for(var i = 0; i < user.coinsOwned.length; i++ ) {
        console.log('This is what is being evaluateed in user.coinsOwned', user.coinsOwned[i])
        if(user.coinsOwned[i].icon === coin[0]) {
          currentCoinIdx = i
          currentCoin = user.coinsOwned
        }
      }
      if(currentCoin === null) {
        console.log('This is the first purchase of this coin')
        currentCoin = {
          name: coin[1],
          icon: coin[0],
          quantity: Number(buyAmt),
          avgBuyVal: price,
          favorite: false
        }
        let update = user.coinsOwned
        update.push(currentCoin)
        const form = {...user, coinsOwned: update, availableCash: newBalance};
        updating(form);
      } else {
        console.log('This is the currentCoin', currentCoin)
        console.log('currentCoinIdx', currentCoinIdx)
        console.log('This is the currentCoin[currentCoinIdx]', currentCoin[currentCoinIdx])
        console.log('This is the (currentCoin[currentCoinIdx].quantity + Number(buyAmt))', (currentCoin[currentCoinIdx].quantity + Number(buyAmt)))
        console.log('This is the ((currentCoin[currentCoinIdx].quantity * currentCoin[currentCoinIdx].avgBuyVal) + (Number(buyAmt) * price))', ((currentCoin[currentCoinIdx].quantity * currentCoin[currentCoinIdx].avgBuyVal) + (Number(buyAmt) * price)))
        let newAvgBuyVal = ((currentCoin[currentCoinIdx].quantity * currentCoin[currentCoinIdx].avgBuyVal) + (Number(buyAmt) * price))/(currentCoin[currentCoinIdx].quantity + Number(buyAmt));
        let updateCurrCoin = {
          ...currentCoin[currentCoinIdx],
          avgBuyVal: newAvgBuyVal,
          quantity: Number(Number(currentCoin[currentCoinIdx].quantity) + Number(buyAmt)),
        }
        console.log('This is NOT the first purchase of this coin')
        let update = user.coinsOwned
        update[currentCoinIdx] = updateCurrCoin
        const form = {...user, coinsOwned: update, availableCash: newBalance};
        updating(form);
      }
    }
    // grab current balance and purchase price
    // if current balance and purchase price don't allow for sale refuse transaction
    // if good proceed and update user profile

  }

  const handleSellClick = () => {
    // grab current profile and coin balances
    // if coin balances do not allow for transaction refuse.
    // if good proceed and update user profile
    let coinOwned = false;
    let coinOwnedIdx = null;
    for(var i = 0; i < user.coinsOwned.length; i++) {
      if(user.coinsOwned[i].icon === coin[0]) {
        console.log('You own ', user.coinsOwned[i].icon)
        coinOwned = true;
        coinOwnedIdx = i
      }
    }
    if(coinOwned && user.coinsOwned[coinOwnedIdx].quantity >= sellAmt) {
      console.log('Congrats you have enough to sell')
      console.log('This is the currentCoin', user.coinsOwned)
      console.log('coinOwnedIdx', coinOwnedIdx)
      console.log('This is the currentCoin[currentCoinIdx]', user.coinsOwned[coinOwnedIdx])
      let updateCurrCoin = {
        ...user.coinsOwned[coinOwnedIdx],
        quantity: Number(user.coinsOwned[coinOwnedIdx].quantity) - Number(sellAmt)
      }
      let newBalance = user.availableCash + (sellAmt * price)
      let update = user.coinsOwned
      update[coinOwnedIdx] = updateCurrCoin
      const form = {...user, coinsOwned: update, availableCash: newBalance};
      console.log('This is what we are about to update the user to ', form)
      updating(form);
    }
  }

  const handleOpen = (e) => {
    setTrade(e.target.id)
    setOpen(true);
  };


  const handleClose = async (e) => {
    const confirmation = e.target.id;
      if(confirmation === 'no') {
        console.log('account is open')
      } else {
        if(trade === 'sell') {
          handleSellClick()
        } else if(trade === 'buy') {
          handleBuyClick()
        }
      }
      setOpen(false);
  };


  return (
    <Container maxWidth="xs">
      <Paper sx={{ padding: 2, marginTop: 16 }}>{props}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell size="small">Buy Amount</TableCell>
                <TableCell size="small">Price Point of {coin}</TableCell>
                <TableCell size="small">Sell Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell size="small">
                  <TextField
                    size="small"
                    type="number"
                    value={buyAmt}
                    onChange={handleBuy}
                  />
                </TableCell>
                <TableCell size="small">$ {price} </TableCell>
                <TableCell size="small">
                  <TextField
                    size="small"
                    type="number"
                    value={sellAmt}
                    onChange={handleSell}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Stack sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingTop: '4px',
        }}>
          {/* <Button variant="contained">ExecuteOrder</Button> */}

          {!guest && <Button variant="contained" onClick={handleOpen} id='buy'>Buy</Button>}
          {!guest && <Button variant="contained" onClick={handleOpen} id='sell'>Sell</Button>}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Reset Account</DialogTitle>
            <DialogContent>
              <DialogContentText>
            Are you sure you want to {trade} {coin[0]}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} id='no'>No</Button>
             <Button onClick={handleClose} id='yes'>Yes</Button>
           </DialogActions>
          </Dialog>

        </Stack>
      </Paper>
    </Container>
  )
}

export default CryptoBuySellTemp;