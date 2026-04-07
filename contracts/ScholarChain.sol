// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScholarChain {

    struct Application {
        uint id;
        string studentId;
        string name;
        uint amount;
        string reason;
        bool funded;
    }

    Application[] public applications;

    event ApplicationCreated(uint id, string studentId);
    event Funded(uint id, address donor);

    function apply(
        string memory _studentId,
        string memory _name,
        uint _amount,
        string memory _reason
    ) public {
        applications.push(Application({
            id: applications.length,
            studentId: _studentId,
            name: _name,
            amount: _amount,
            reason: _reason,
            funded: false
        }));

        emit ApplicationCreated(applications.length - 1, _studentId);
    }

    function fund(uint _id) public payable {
        require(_id < applications.length, "Invalid ID");
        require(!applications[_id].funded, "Already funded");
        
        // In a real application, you might transfer the funds to the student's address. 
        // Here we just accept the funding to the contract.
        
        applications[_id].funded = true;

        emit Funded(_id, msg.sender);
    }

    function getCount() public view returns(uint){
        return applications.length;
    }
}
