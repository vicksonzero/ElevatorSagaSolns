{
    init: function(elevators, floors) {
        // Whenever the elevator is idle (has no more queued destinations) ...
        [
            elevators[0]
        ]
        .forEach(function(elevator){
            elevator.on("idle", function() {
                elevator.goToFloor(0);
                elevator.goToFloor(1);
                elevator.goToFloor(2);
                elevator.goToFloor(3);
                elevator.goToFloor(4);
                elevator.goToFloor(5);
                elevator.goToFloor(6);
                elevator.goToFloor(7);
            });
            elevator.on("floor_button_pressed", function(floorNum) {
                // Maybe tell the elevator to go to that floor?
            })
        });
        [
            elevators[1],
            elevators[2]
        ]
        .forEach(function(elevator){
            elevator.on("idle", function() {
                elevator.goToFloor(0);
            });
            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.goToFloor(floorNum);
            })
            floors.forEach(function(floor){
                floor.on("down_button_pressed", function() {
                    elevator.goToFloor(floor.floorNum());
                });
            });
            
            
        });
        
        
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
        // now we do
        //console.log(elevators[0].getPressedFloors());
        elevators.forEach(function(elevator){
            if(elevator.loadFactor()>0.7){// quite full
                gotoPressedFloors(elevator);
            }
            
            
        });
        function gotoPressedFloors(elevator){
            var pressedFloors = elevator.getPressedFloors().sort();
            //console.log(pressedFloors);
            elevator.stop();
            pressedFloors.forEach(function(floor){
                elevator.goToFloor(floor);
            });
        }
    },

}
