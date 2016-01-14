{
    init: function(elevators, floors) {
        // Whenever the elevator is idle (has no more queued destinations) ...
        
        // common init
        elevators.forEach(function(elevator){
            elevator.favoriteFloor = [];
        });
        elevators[0].favoriteFloor=[0,1,2];
        elevators[1].favoriteFloor=[3,4,5];

        [
            
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
            elevators[0],
            elevators[1]
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
                    if(elevator.loadFactor()<1){
                        if(elevator.favoriteFloor.indexOf(floor.floorNum())!=-1){
                            elevator.goToFloor(floor.floorNum());
                        }
                    }
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
