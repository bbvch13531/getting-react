import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component{
	constructor(){
		super();
		// this.renderInventory=this.renderInventory.bind(this);
		// this.handleChange=this.handleChange.bind(this);
		// this.renderLogin=this.renderLogin.bind(this);
		// this.authenticate=this.authenticate.bind(this);
		// this.authHandler=this.authHandler.bind(this);
		// this.logout=this.logout.bind(this);
		this.state = {
			uid: null,
			owner: null
		}
	}
	componentDidMount() {
		base.onAuth((user) =>{
			if(user){
				this.authHandler(null,{user});
			}
		});
	}

	authenticate = (provider) =>{
		console.log(`Try to log in with ${provider}`);
		base.authWithOAuthPopup(provider, this.authHandler);
	};

	logout = () => {
		base.unauth();
		this.setState({ uid: null });
	};

	authHandler = (err, authData) =>{
		console.log(authData);

		if(err){
			console.log(err);
			return ;
		}

		//grab the store info
		const storeRef = base.database().ref(this.props.storeId);

		//query the firebase once for the store data
		storeRef.once('value',(snapshot) => {
			const data =  snapshot.val() || {};

			//claim it as our own if there is no owner already
			if(!data.owner){
				storeRef.set({
					owner:authData.user.uid
				});
			}

			this.setState({
				uid:authData.user.uid,
				owner:data.owner || authData.user.uid
			})
		});
	};

	renderLogin = () =>{
		return (
			<nav className="Login">
				<h2>Inventory</h2>
				<p>Sign in to manage your store's inventory</p>
				<button className="github" onClick={() => this.authenticate('github')}>Log In With Github</button>
				<button className="facebook" onClick={() => this.authenticate('facebook')}>Log In With Facebook</button>
			</nav>
		)
	};

	handleChange = (e, key) => {
		const fish = this.props.fishes[key];
		//take a copy of that fish and update it with the new data

		const updatedFish = {
			...fish,
			[e.target.name]: e.target.value
		}
		this.props.updateFish(key, updatedFish);
		console.log(e.target.name,e.target.value);
	};

	renderInventory = (key) =>{
		const fish = this.props.fishes[key];

		return(
	    <div className="fish-edit" key={key}>
				<input type="text" name="name" value={fish.name} placeholder="Fish name" onChange={ (e) => this.handleChange(e,key)}/>
				<input type="text" name="price" value={fish.price} placeholder="Fish price" onChange={ (e) => this.handleChange(e,key)}/>
				<select type="text" name="status" value={fish.status} placeholder="Fish status" onChange={ (e) => this.handleChange(e,key)}>
					<option value="avaliable">Fresh!</option>
					<option value="unavaliable">Sold Out!</option>
				</select>
				<textarea type="text" name="desc" value={fish.desc} placeholder="Fish desc" onChange={ (e) => this.handleChange(e,key)}></textarea>
				<input type="text" name="image" value={fish.image} placeholder="Fish image" onChange={ (e) => this.handleChange(e,key)}/>
	    	<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
	    </div>
		)
	};

	render(){
		const logout = <button onClick={() => this.logout() }>Log Out!</button>
		//check if they are not logged in at all
		if(!this.state.uid){
			return <div>{this.renderLogin()}</div>
		}
		//check if they are owner of the current store
		if(this.state.uid !== this.state.owner){
			return(
				<div>
					<p>Sorry you aren't the owner of the store!</p>
					{logout}
				</div>
			)
		}

		return (
			<div>
				<p>Inventory</p>
				{logout}
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish}/>

				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		)
	}

	static propTypes={
		fishes: React.PropTypes.object.isRequired,
		updateFish: React.PropTypes.func.isRequired,
		removeFish: React.PropTypes.func.isRequired,
		addFish: React.PropTypes.func.isRequired,
		loadSamples: React.PropTypes.func.isRequired,
		storeId: React.PropTypes.string.isRequired,
};
}



export default Inventory;