//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// used as the foundation of the contract
interface IERC20 {

    function totalSupply() external view returns (uint256);

    function balanceOf(address _owner) external view returns (uint256);

    function transfer(address _to, uint256 _value) external returns (bool);

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool);

    function approve(address _spender, uint256 _value) external returns (bool);

    function allowance(address _owner, address _spender) external view returns (uint256);


    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
}

contract MyERC20 is IERC20 {

    uint256 public _totalSupply; // total number of tokens

    mapping(address => uint256) private _balances; // the number of tokens each user has
    mapping(address => mapping(address => uint256)) private _allowances; // information who entrusted their money to whom

    string public name; // name of token
    string public symbol; // symbol of token
    uint8 public decimals; // number of decimals


    constructor (string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        console.log("111");
    }
    // getters
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public view virtual override returns (uint256) {
        return _balances[_owner];
    }

    // transfers token to another user
    function transfer(address _to, uint256 _value) public virtual override returns (bool) {
        require(_balances[msg.sender] >= _value, "Not enough tokens");
        require(_to != address(0), "Enter correct address");
        
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // uses with function "approve", send tokens from another user to another user
    function transferFrom(address _from, address _to, uint256 _value) public virtual override returns (bool) {
        require(_allowances[_from][msg.sender] >= _value, "You try to transfer more than allowed");
        require(_balances[_from] >= _value, "Not enough tokens");

        _allowances[_from][msg.sender] -= _value;
        _balances[_from] -= _value;
        _balances[_to] += _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    // approves someone to use your tokens
    function approve(address _spender, uint256 _value) public virtual override returns (bool) {
        _allowances[msg.sender][_spender] = _value;
        
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // also getter
    function allowance(address _owner, address _spender) public view virtual override returns (uint256) {
        return _allowances[_owner][_spender];
    }

    // deletes tokens from system
    function _burn(address account, uint256 amount) internal {
        require(amount <= _balances[account], "Not enough tokens");

        _totalSupply -= amount;
        _balances[account] -= amount;

        emit Transfer(account, address(0), amount);
    }

    // adds token to system
    function _mint(address account, uint256 amount) internal {
        _totalSupply += amount;
        _balances[account] += amount;

        emit Transfer(address(0), account, amount);
    }

    // converts your tokens to ETH
    function withdraw(address payable account, uint amount) public {
        require(account == msg.sender, "Only owner of account can withdraw ETH");
        _burn(account, amount);
        account.transfer(amount/10000);
    }
    
    // converts your ETH to tokens
    receive() external payable {
        _mint(msg.sender, msg.value*10000);
    }

    // 1 ETH = 10000 DVT
}
