angular.module('starter.sensors', [])
    .controller('SensorsCtrl', SensorsCtrl);

SensorsCtrl.$inject = []
function SensorsCtrl() {
    var vm = this;
    var accelerationWatch = undefined;
    var positionWatch = undefined;
    vm.coordinates = {
        latitude: undefined,
        longitude: undefined
    };
    vm.acceleration = {
        x: undefined,
        y: undefined,
        z: undefined
    };


    positionWatch = navigator.geolocation.watchPosition(
        onPositionUpdate,
        onPositionError, {
            enableHighAccuracy: true
        });
    if (undefined === window.DeviceMotionEvent) {
        log('Device motion not supported :(', 5000);
        throw new Error('Device motion not supported :(');
    }

    window.addEventListener('devicemotion', onAccelerationUpdate, true);



    function onPositionError(err) {
        console.error('Failed to retrieve position', err);
    }

    function onPositionUpdate(position) {
        vm.coordinates.latitude = position.coords.latitude;
        vm.coordinates.longitude = position.coords.longitude;
    }

    function onAccelerationUpdate(event) {
        console.log(event.accelerationIncludingGravity);
        var acceleration = event.accelerationIncludingGravity;
        vm.acceleration.x = acceleration.x;
        vm.acceleration.y = acceleration.y;
        vm.acceleration.z = acceleration.z;
    }
}