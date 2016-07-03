{
	init: function(elevators, floors) {
		// Whenever the elevator is idle (has no more queued destinations) ...
		var overmind = {
			masterSchedule: []
		};
		// common init
		elevators.forEach(function(elevator, key){
			elevator.id=key;
			elevator.name=key;
			elevator.tags = [];
			elevator.hasTag = hasTag;
			elevator.focused = false;
			elevator.setFocus = setFocus;
			elevator.on("idle", function () {
				elevator.setFocus(false);
			})

			elevator.on("floor_button_pressed", function(floorNum) {
				elevator.goToFloor(floorNum);
				if(floors[floorNum].favoriteLift != elevator.id){
					var givingUpFloor = elevator.favoriteFloor.find((floorNum) => elevator.destinationQueue.indexOf(floorNum) == -1 ) || 0;
					swapFavorite(givingUpFloor, floorNum)
				}
			});
			
			elevator.favoriteFloor = [];
			floors.forEach(function(floor){
				floor.on("down_button_pressed", function() {
					if(elevator.loadFactor()<1){
						if(elevator.favoriteFloor.indexOf(floor.floorNum())!=-1){
							elevator.goToFloor(floor.floorNum());
						}
					}
				});
			});
		});
		
		var i=0, interval = Math.ceil(elevators.length/floors.length)+1;
		console.log(interval);
		floors.forEach(function (floor, key) {
			floor.id = key;
			floor.favoriteLift = Math.floor((i++) / interval);
			elevators[floor.favoriteLift].favoriteFloor.push(floor.id);
			console.log(floor.favoriteLift);
			
		})
		
		
		// [1].forEach( function (elevatorID) { masterElevator(elevators[elevatorID]); });
		// [0].forEach( function (elevatorID) { slaveElevator(elevators[elevatorID]); });
		
		
		function masterElevator(elevator) {
			elevator.name = "master";
			elevator.tags.push("master");
			elevator.on("idle", function () {
				if(!elevator.focused){
					if(elevator.loadFactor()>0){
						focusInside(elevator, (elevator.currentFloor() < floors.length/2?ascending:descending));
					}else{
						focusOutside(elevator, "down", (elevator.currentFloor() < floors.length/2?ascending:descending));
					}
					overmind.masterSchedule = elevator.destinationQueue;
				}
			})
			
		}

		function slaveElevator(elevator) {
			elevator.name = "slave";
			elevator.tags.push("slave");
			elevator.on("idle", function () {
				if(!elevator.focused){
					var remainingFloors = floors.map((floor)=>floor.floorNum())
					.filter(function (floorNum) {
						return overmind.masterSchedule.indexOf(floorNum)<0;
					})
					// console.log(remainingFloors);

					var pressedFloors = floors.filter(function (floor) {
						return floor.buttonStates.up == "activated" || floor.buttonStates.down == "activated";
					})
					.map((floor)=>floor.floorNum())
					.filter(function (floorNum) {
						return remainingFloors.indexOf(floorNum) !=-1;
					})
					// console.log(pressedFloors);
					console.log("slave TAKE MASTER");
					pressedFloors.forEach(function (floorNum) {
						elevator.goToFloor(floorNum);
					})
				}
			});
		}

		function hasTag(tagName) {
			return this.tags.indexOf(tagName) > -1;
		}

		function setFocus(val) {
			this.focused = val;
			// console.log(this.name, "is", (this.focused?"":"not"), "focused");
		}
		
		function focusInside(elevator, sorting) {
			var pressedFloors = elevator.getPressedFloors();
			if(pressedFloors.length>0){
				console.log("focusInside: ", elevator.id);
				pressedFloors.sort((sorting || ascending));
				elevator.stop();
				pressedFloors.forEach(function (floorNum) {
					elevator.goToFloor(floorNum);
				})
				console.log(elevator.name, "focus on inside");
				elevator.setFocus(true);
			}
		}

		function focusOutside(elevator, direction, sorting) {
			var pressedFloors = floors.filter(function (floor) {
				return floor.buttonStates[direction] == "activated";
			})
			if(pressedFloors.length>0){
				console.log("focusOutside:", direction, elevator.id);
				elevator.stop();
				pressedFloors.map(function (floor) {
					return floor.floorNum()
				})
				.sort((sorting || ascending))
				.forEach(function (floorNum) {
					elevator.goToFloor(floorNum);
				})
				console.log(elevator.name, "focus on outside");
				elevator.setFocus(true);
			}
		}

		function swapFavorite(floorNumA, floorNumB) {
			console.log("swap", floorNumA, floorNumB);
			var floorA = floors[floorNumA];
			var floorB = floors[floorNumB];
			
			var liftA = elevators[floorA.favoriteLift];
			var liftB = elevators[floorB.favoriteLift];
			
			liftA.favoriteFloor.splice(liftA.favoriteFloor.indexOf(floorA));
			liftA.favoriteFloor.push(floorNumB);
			liftB.favoriteFloor.splice(liftB.favoriteFloor.indexOf(floorB));
			liftB.favoriteFloor.push(floorNumA);
			
			floorA.favoriteLift = liftB.id;
			floorB.favoriteLift = liftA.id;
			console.log(
				floors.map(function(floor) {
					return floor.favoriteLift;
				})
				.join(" ")
			);
			console.log(
				elevators.map(function(elevator) {
					return elevator.favoriteFloor.join("");
				})
				.join(", ")
			);
		}
		
		function ascending(a,b) {
			return Number(a) - Number(b)
		}
		
		function descending(a,b) {
			return Number(b) - Number(a)
		}
		
	},
	update: function(dt, elevators, floors) {
		// We normally don't need to do anything here
		// now we do
		elevators.filter(function (elevator) {
			// return elevator.hasTag("master");
			return true;
		}).forEach(function(elevator){
			if(!elevator.focused && elevator.loadFactor()>0.6){// quite full
				focusInside(elevator, ascending);
			}
		});
		
		function focusInside(elevator, sorting) {
			var pressedFloors = elevator.getPressedFloors();
			if(pressedFloors.length>0){
				console.log(elevator.name, "focusInside: ");
				pressedFloors.sort((sorting || ascending));
				elevator.stop();
				pressedFloors.forEach(function (floorNum) {
					elevator.goToFloor(floorNum);
				})
				console.log(elevator.name, "focus on inside");
				elevator.setFocus(true);
			}
		}
		
		
		function ascending(a,b) {
			return Number(a) - Number(b)
		}
		
		function descending(a,b) {
			return Number(b) - Number(a)
		}
		
	}
	
}
