var host = 'cpsc484-01.yale.internal:8888';
$(document).ready(function () {
	frames.start();
	twod.start();
});

var frames = {
	socket: null,

	start: function () {
		var url = 'ws://' + host + '/frames';
		frames.socket = new WebSocket(url);
		frames.socket.onmessage = function (event) {
			var command = frames.timer_function(JSON.parse(event.data));
			// if (command !== null) {
			// 	sendWristCommand(command);
			// }
		};
	},

	timer_function: function (frame) {
		var command = null;
		// no people break
		if (frame.people.length < 1) {
			return command;
		}

		// Normalize by subtracting the root (pelvis) joint coordinates

		var timer_run = false;
		var timer;

		// we check if the user has both of his hands in the air!

			// we will start the timer, first time the user put it's both hands in the air
			if (!timer_run) {
				var count = 3;
				timer_run = true;
				timer = setInterval(function () {
					count--;
                    console.log(chest_x);
                    var pelvis_y = frame.people[0].joints[2].position.y;

                    var chest_x = frame.people[0].joints[2].position.y;
					// When the timer is equal to 0 we will redirect to a tutorial page
					if (count === 0) {
						console.log('DONE');
						clearInterval(timer);
						timer = 0; // stop the interval
						timer_run = false;
                        if (chest_x < 0) {
                            console.log("left");
                        } else {
                            console.log("right");
                        }
						window.location.href = 'page4.html'; // redirect to page2.html
					} else if (count < 0) {
						console.log('Counter should not go below 0');
						clearInterval(timer); // stop the interval
						timer_run = false;
					} else {
						document.getElementById('timer').innerHTML = count;
						console.log('TIMER IS MOVING!');
					}
				}, 1000);
				console.log('TIMER IS STARTED!');
			} else {
				console.log('TIMER IS ALREADY RUNNING!');
			}
		}
	};

var twod = {
	socket: null,

	start: function () {
		var url = 'ws://' + host + '/twod';
		twod.socket = new WebSocket(url);
		twod.socket.onmessage = function (event) {
			twod.show(JSON.parse(event.data));
		};
	},

	show: function (twod) {
		$('.twod').attr('src', 'data:image/pnjpegg;base64,' + twod.src);
	},
};