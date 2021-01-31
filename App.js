import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import NoteDiv from "./NoteDiv";
import "./App.css";

class App extends Component {
 constructor(){
   super();
   this.state = { storageValue: "", 
    web3: null, 
    accounts: null,
    contract: null,
    curTitle: "",
    curNote: "",
    currentKey:"",
    searchKey:"",
    editMode:true
    }

    this.publish = this.publish.bind(this);
    this.setDate = this.setDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
 }
  
    

  componentDidMount = async () => {
    this.setDate();
    try {
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
        );
        
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Please make sure you have metamask extension installed to talk to blockchain`,
      );
      console.error(error);
    }
  };

  /*runExample = async () => {
    const { accounts, contract } = this.state;
    //await contract.methods.set("set h sab").send({ from: accounts[0] });
    const response = await contract.methods.get().call();
    console.log(response);
    this.setState({ storageValue: response });
  };*/

  async publish() {
    const {accounts, contract,curNote,curTitle,currentKey}= this.state;
    await contract.methods.createNote(curNote,curTitle,currentKey).send({ from: accounts[0]});
    this.setState({
      curTitle:"",
      curNote:"",
      searchKey:""
    })
  }; 

  setDate (){
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getYear();
    var key  = day.toString()+month.toString()+year.toString();
    console.log(key);
    this.setState({currentKey:key});
  }

  handleChange(e){
    const { name , value} = e.target;
    this.setState({
      [name]:value
    })
  }

  async handleSubmit(){
    const { contract } = this.state;
    const rNote = await contract.methods.viewNote(this.state.searchKey).call();
    const rTitle = await contract.methods.viewTitle(this.state.searchKey).call();
    console.log("i am clicked");
    console.log(rNote);
    console.log(rTitle);
    this.setState((prev)=>{
      return(
          this.setState({
            curTitle:rTitle,
            curNote:rNote,
            currentKey:prev.searchKey,
            searchKey:"",
            editMode:false
          })
      )
        
    })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="sideBar">
          <button onClick={this.publish}>Publish</button>
          <p>enter daymonthyear</p>
          <input name="searchKey" className="Search" type="text" placeholder="key" onChange={this.handleChange}/>
          <button onClick={this.handleSubmit}>search</button>
        </div>
        {this.state.editMode?
           <div className="main">
           <h1 style={{marginLeft:200}}>Notes capsule</h1>
           <h1>{this.state.storageValue}</h1>
           <input name="curTitle" className="Title" type="text" placeholder="Title" onChange={this.handleChange}/>
             <div>
                 <textarea name="curNote" placeholder="start here..." onChange={this.handleChange}></textarea>
                 <p>{this.state.curTitle} {this.state.curNote} {this.state.currentKey} {this.state.searchKey}</p>
             </div>
         </div>:
         <div style={{margin:40}}>
           <h1>{this.state.curTitle}</h1>
            <p>{this.state.curNote}</p>
         </div>
         }
        
      </div>
    );
  }
}

export default App;
