pragma solidity 0.5.16;

contract SimpleStorage {
  
  //idea is to create a arrays of accounts having array of notes
  
  //account struct
  struct account{
      //no. of notes
      uint n;
      mapping(string => string) titles;
      //array of all the notes
      mapping(string => string) notes;
  }
  

  //hash map keys are of address value account
  mapping(address => account) public accounts;

  /*event NoteCreated(
    uint noOfNotes,
    string content,
    address add
  );*/

function viewTitle(string memory _date) public view returns(string memory ti){
     ti = (accounts[msg.sender].titles[_date]);
 }

 function viewNote(string memory _date) public view returns(string memory mem){
     mem = (accounts[msg.sender].notes[_date]);
 }

  function createNote(string memory _content,string memory _title,string memory _date) public {
    accounts[msg.sender].notes[_date] = _content;
    accounts[msg.sender].titles[_date] = _title;
    accounts[msg.sender].n++;
    //emit NoteCreated(accounts[msg.sender].n, _content, msg.sender);
  }
  
}
