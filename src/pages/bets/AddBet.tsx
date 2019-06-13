import * as React from 'react';
import WeatherBet from '../../contracts/BettingContract.json';
import Betlist from '../../contracts/Betlist.json';
import { FormControl, InputLabel, TextField, Select, MenuItem } from '@material-ui/core';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Redirect } from 'react-router';
import { differenceInSeconds, isAfter, getUnixTime } from 'date-fns';
import getWeb3 from '../../web3/getWeb3.js';
import { status } from '../../model';



enum betVisability {
  Public = "Public",
  Private = "Private"
}

enum City {
  Rotterdam = "Rotterdam",
  Amsterdam = "Amsterdam",
  Den_Haag = "Den Haag",
  Utrecht = "Utrecht",
  Groningen = "Groningen",
  Leeuwarden = "leeuwarden",
  Den_bosch = "Den Bosch",
  Eindhoven = "Eindhoven",
  Tilburg = "Tilburg"
}

type Props = {};
type State = {
  web3: any,
  accounts: string[],
  betAmount: string,
  status: status,
  redirect: boolean,
  date: Date | null
  visability: betVisability,
  fieldsDisabled: boolean,
  newContractAddress: string,
  city: City,
  degrees: number,
  betList: any
};

const visabilityOptions = Object.values(betVisability).map(k => {
  return (
    <MenuItem value={k}>{k.toString()}</MenuItem>
  );
});

const CityOptions = Object.values(City).map(k => {
  return (
    <MenuItem value={k}>{k.toString()}</MenuItem>
  );
});


// console.log(CityKeys);


class AddBet extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: [],
      betAmount: "1",
      status: status.Add,
      redirect: false,
      date: new Date(),
      visability: betVisability.Public,
      fieldsDisabled: false,
      newContractAddress: '',
      city: City.Rotterdam,
      degrees: 15,
      betList: null
    }
  }

  async componentDidMount() {
    const web3 = await getWeb3();
    web3.eth.transactionConfirmationBlocks = 1;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Betlist.networks[networkId];
    const betList = await new web3.eth.Contract(
      Betlist.abi,
      deployedNetwork && deployedNetwork.address,
    );
    this.setState({
      ...this.state,
      web3: web3,
      accounts: accounts,
      betList: betList
    });

    console.log(await betList.methods.GetContracts().call());
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = event.target.name;
    const value: any = event.target.value;
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  handleSelectChangeCity = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const value: City = event.target.value as City;
    this.setState({ city: value });
  };

  handleSelectChangeVisability = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const value: betVisability = event.target.value as betVisability;
    this.setState({ visability: value });
  }


  handleDateChange = (date: Date | null) => {
    this.setState({ date: date });
  };

  deployContract = async (e) => {
    e.preventDefault();
    if (this.state.date != null && isAfter(this.state.date!, new Date())) {
      try {
        this.setState({ status: status.Deploying, fieldsDisabled: true });
        const amountOfSeconds = differenceInSeconds(this.state.date, new Date());
        const account = this.state.accounts[0];
        const valueAmount = await this.state.web3.utils.toWei(this.state.betAmount, "ether");
        const weatherContract = await new this.state.web3.eth.Contract(WeatherBet.abi);
        const degrees = this.state.degrees;
        const location = this.state.city;

        console.log(
          amountOfSeconds,
          getUnixTime(this.state.date),
          degrees,
          location);

        // const betDeploy = await this.state.betList.methods.createBet(
        //   amountOfSeconds,
        //   getUnixTime(this.state.date),
        //   degrees,
        //   location
        // ).send({
        //   from: account,
        //   value: valueAmount,
        //   gas: 3000000
        // });

        // console.log(betDeploy);
        
        
        
        
        // this.setState({ status: status.Done, newContractAddress: deployed.options.address });
        // window.setTimeout(() => { this.setState({ redirect: true }) }, 3000);
      } catch (err) {
        this.setState({ status: status.Error, fieldsDisabled: false });
        throw err;
      }
    }
  };

  handleRedirect = (contractAddress: string): any => {
    let link: string = "/bets/" + contractAddress;
    return <Redirect to={link} />
  }

  public render() {
    return (
      <div>
        {this.state.redirect && this.handleRedirect(this.state.newContractAddress)}
        <form onSubmit={this.deployContract}>
          <TextField
            id="betAmount"
            name="betAmount"
            label="Bet Amount"
            value={this.state.betAmount}
            onChange={this.handleChange}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            disabled={this.state.fieldsDisabled}
          />
          <TextField
            id="degrees"
            name="degrees"
            label="Graden"
            value={this.state.degrees}
            onChange={this.handleChange}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            disabled={this.state.fieldsDisabled}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              margin="normal"
              id="weather-date-picker"
              name="date"
              label="Datum en tijd van weer"
              disablePast={true}
              value={this.state.date}
              onChange={this.handleDateChange}
              disabled={this.state.fieldsDisabled}
              KeyboardButtonProps={{
                'aria-label': 'Datum veranderen',
              }}
            />
          </MuiPickersUtilsProvider>
          <FormControl>
            <InputLabel htmlFor="visability-select">Zichtbaarheid</InputLabel>
            <Select
              value={this.state.visability}
              onChange={this.handleSelectChangeVisability}
              disabled={this.state.fieldsDisabled}
            >
              {visabilityOptions}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="city-select">Plaats</InputLabel>
            <Select value={this.state.city} disabled={this.state.fieldsDisabled} onChange={this.handleSelectChangeCity}>
              {CityOptions}
            </Select>
          </FormControl>
          <input type="submit" value="contract aanmaken" />
        </form>
        <p>Huidige status: {this.state.status}</p>
        {this.state.newContractAddress && <p>Contract aangemaakt!: {this.state.newContractAddress}</p>}
      </div>
    )
  }
}

export default AddBet;