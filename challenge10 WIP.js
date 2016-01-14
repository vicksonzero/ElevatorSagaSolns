{
    init: function(elevators, floors) {
        // Whenever the elevator is idle (has no more queued destinations) ...
        
        // common init
        elevators.forEach(function(elevator){
            elevator.favoriteFloor = [];
            elevator.dirCode = 1;
            elevator.peopleWaiting = [];
            floors
            .sort(function(a,b){return a.floorNum()-b.floorNum();})
            .forEach(function(floor){
                elevator.peopleWaiting.push({fid:floor.floorNum(),cnt:0});
            });
        });
        
        // individual init
        elevators[0].favoriteFloor=[1,2,3,4,5,6,7,8,9,10,11,12];
        elevators[1].dirCode=-1;

        // individual event
        [
            elevators[1]
        ]
        .forEach(function(elevator){
            elevator.on("idle", function() {
                floors.sort(function(a,b){return b.floorNum()-a.floorNum();}).forEach(function(floor){
                    elevator.goToFloor(floor.floorNum());
                });
            });
            elevator.on("floor_button_pressed", function(floorNum) {
                // Maybe tell the elevator to go to that floor?
            })
            floors.forEach(function(floor){
                floor.on("down_button_pressed", function() {
                    elevator.peopleWaiting[floor.floorNum()].cnt++;
                });
            });
        });
        [
            elevators[0]
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
            var pressedFloors = elevator.getPressedFloors().sort(function(a,b){return elevator.dirCode*(a-b);});
            console.log("HI");
            console.log(pressedFloors);
            elevator.stop();
            pressedFloors.forEach(function(floor){
                elevator.goToFloor(floor);
            });
        }
    },

}
