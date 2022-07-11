// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

struct OrderDetails{
    address seller_address;
    address buyer_address;
    uint token_amount;
    uint delivery_key;
}

contract MudraToken{
    string public constant name = "Mudra";
    string public constant symbol = "MDR";
    uint256 public  totalSupply=0;
    mapping(address=>uint) private balance;
    mapping(uint=>OrderDetails) order;


    // 1 ether = 1000 mudra
    function buyMudra(uint noOfTokens) public payable{
        require(noOfTokens*1000000000000000<= msg.value,"Please send more ethers. Rate is- 1000 mudras for 1 ether.");
        balance[msg.sender]+=noOfTokens;
        totalSupply+=noOfTokens;
    }

    function cashInMudra(uint noOfTokens) public returns(bool){
        require(noOfTokens<=balance[msg.sender],"You don't have sufficient tokens.");
        balance[msg.sender]-=noOfTokens;
        totalSupply-=noOfTokens;
        payable(msg.sender).transfer(noOfTokens*1000000000000000);
        return true;
    }

    function myBalance() public view returns(uint){
        return balance[msg.sender];
    }

    modifier YouAreNotBuyer(uint orderId){
        require(order[orderId].buyer_address==msg.sender,"Sorry, You are not the buyer.");
        _;
    }

    function random(address seller, uint tokens) private view returns (uint) {
        // sha3 and now have been deprecated
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, totalSupply,balance[msg.sender],balance[seller],tokens)));
        // convert hash to integer
        // players is an array of entrants
        
    }

    function purchaseItem(uint orderId, address seller, uint amount) public returns(bool){
        require(balance[msg.sender]>=amount,"You don't have sufficient tokens.");
        uint randomKey=random(seller,amount)%9000 + 1000;
        address myAddr=msg.sender;
        order[orderId]=OrderDetails(seller,myAddr,amount, randomKey);
        balance[msg.sender]-=amount;
        return true;
    }

    function checkDeliveryKey(uint orderId)public view YouAreNotBuyer(orderId) returns(uint){
        // require(order[orderId].buyer_address==msg.sender,"Sorry, You are not the buyer.");
        return order[orderId].delivery_key;
    }

    function cancelOrder(uint orderId)public YouAreNotBuyer(orderId) returns(bool){
        balance[order[orderId].buyer_address]+=order[orderId].token_amount;
        delete order[orderId];
        return true;
    }

    function deliverItem(uint orderId, uint randomKey) public returns(bool){
        require(order[orderId].delivery_key==randomKey,"Sorry, wrong delivery key. Please recheck.");
        balance[order[orderId].seller_address]+=order[orderId].token_amount;
        delete order[orderId];
        return true;
    }
}