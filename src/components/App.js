import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import SampleFishes from '../SampleFishes';
import base from '../base';

class App extends React.Component {

	constructor() {
		super();
		// this.addFish = this.addFish.bind(this);
		// this.loadSamples = this.loadSamples.bind(this);
		// this.updateFish = this.updateFish.bind(this);
		// this.addToOrder = this.addToOrder.bind(this);
		// this.removeFish = this.removeFish.bind(this);
		// this.removeToOrder = this.removeToOrder.bind(this);

		//getinitialstate
		this.state={
			fishes:{},
			order:{}
		};
	}

	componentWillMount() {
		// this runs right before the <App> is rendered
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`,{
			context:this,
			state: 'fishes'
		});
		//check if there is any order in local storage
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
		if(localStorageRef){
			//update our App component's order state
			this.setState({
				order: JSON.parse(localStorageRef)
			})
		}
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem(`order-${this.props.params.storeId}`,JSON.stringify(nextState.order));
	}

	updateFish = (key, updatedFish) => {
		var fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		console.log(fishes.fish1,key);
		this.setState({ fishes });
	};
 	removeFish = (key) =>{
 		var fishes = {...this.state.fishes};
 		fishes[key]=null;
 		this.setState({ fishes });
 	};

	addFish = (fish) => {
		//update our state
		const fishes={...this.state.fishes};
		//add in our new fish
		const timestamp=Date.now();
		fishes[`fish-${timestamp}`]=fish;
		//set state
		this.setState({ fishes : fishes });
	};

	loadSamples = () =>{
		this.setState({
			fishes: SampleFishes
		})
	};

	addToOrder = (key) =>{
		//take a copy of our state
		const order={...this.state.order};
		//update or add the new number of fish ordered
		order[key] = order[key] + 1 || 1;
		//update our state
		this.setState({ order})
	};
	
	removeToOrder = (key) =>{
		const order={...this.state.order};
		delete order[key];
		this.setState({ order})
	};

	render() {
		return(
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood"/>
					<ul className="list-of-fishes">
						{
							Object
								.keys(this.state.fishes)
								.map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)
						}
					</ul>
				</div>
				<Order 
				fishes={this.state.fishes} 
				order={this.state.order }
				params={this.props.params}
				removeToOrder={this.removeToOrder}
				/>
				<Inventory 
				addFish={this.addFish} 
				loadSamples={this.loadSamples} 
				fishes={this.state.fishes}
				updateFish={this.updateFish}
				removeFish={this.removeFish}
				storeId={this.props.params.storeId}
				/>
			</div>
		) 
	}
}
App.propTypes = {
	params: React.PropTypes.object.isRequired
};
export default App;