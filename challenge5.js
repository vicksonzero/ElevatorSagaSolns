{
    init: function(elevators, floors) {
        // Whenever the elevator is idle (has no more queued destinations) ...
        elevators.forEach(function(elevator){
            elevator.
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
        });
        (function(elevator){
            elevator.on("idle", function() {
                elevator.goToFloor(7);
                elevator.goToFloor(6);
                elevator.goToFloor(5);
                elevator.goToFloor(4);
                elevator.goToFloor(3);
                elevator.goToFloor(2);
                elevator.goToFloor(1);
                elevator.goToFloor(0);
            });
            elevator.on("floor_button_pressed", function(floorNum) {
                // Maybe tell the elevator to go to that floor?
            })
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
