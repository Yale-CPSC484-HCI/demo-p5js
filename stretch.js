var host = 'cpsc484-01.yale.internal:8888';
$(document).ready(function () {
	frames.start();
	twod.start();
});
var positions = [];

var frames = {
	socket: null,

	start: function () {
		var url = 'ws://' + host + '/frames';
		frames.socket = new WebSocket(url);
		frames.socket.onmessage = function (event) {
			var command = frames.get_left_wrist_command(JSON.parse(event.data));
			// if (command !== null) {
			// 	sendWristCommand(command);
			// }
		};
        this.timer_function();
	},

	timer_function: function (frame) {
		var command = null;
		// no people break
		if (frame.people.length < 1) {
			return command;
		}

        var score = 0;
        var list = ["pics/opt.png", "pics/opt2.png"];
        var total_stretches = 2;
        var num = 0;

		var timer_run = false;
		var timer;

		// we check if the user has both of his hands in the air!

        if (!timer_run) {
            var count = 10;
            var succeeded = false;
            timer_run = true;
            timer = setInterval(function () {
                count--;
                command = 0;

                // Normalize by subtracting the root (pelvis) joint coordinates
                var chest_x = positions.joints[2].position.x;
                var chest_y = positions.joints[2].position.y;
                var chest_z = positions.joints[2].position.z;
                var nose_x = positions.joints[27].position.x;
                var nose_y = positions.joints[27].position.y;
                var nose_z = positions.joints[27].position.z;
                var left_elbow_x = positions.joints[6].position.x;
                var left_elbow_y = positions.joints[6].position.y;
                var left_elbow_z = positions.joints[6].position.z;
                var left_wrist_x = positions.joints[7].position.x;
                var left_wrist_y = positions.joints[7].position.y;
                var left_wrist_z = positions.joints[7].position.z;

                var left_knee_x = positions.joints[19].position.x;
                var left_knee_y = positions.joints[19].position.y;
                var left_knee_z = positions.joints[19].position.z;

                var pelvis_x = positions.joints[0].position.x;
                var pelvis_y = positions.joints[0].position.y;
                var pelvis_z = positions.joints[0].position.z;

                var right_knee_x = positions.joints[23].position.x;
                var right_knee_y = positions.joints[23].position.y;
                var right_knee_z = positions.joints[23].position.z;

                var right_elbow_x = positions.joints[13].position.x;
                var right_elbow_y = positions.joints[13].position.y;
                var right_elbow_z = positions.joints[13].position.z;
                var right_wrist_x = positions.joints[14].position.x;
                var right_wrist_y = positions.joints[14].position.y;
                var right_wrist_z = positions.joints[14].position.z;

                if (left_elbow_y < chest_y && left_wrist_y < nose_y && left_wrist_x >left_elbow_x) {
                // console.log(left_elbow_y + ' ' + chest_y + ' ' + left_wrist_y + ' ' + nose_y + ' ' + left_wrist_x + ' ' + left_elbow_x);
                console.log("stretch 1");
                command = 1;
                } else if (right_elbow_y < chest_y && right_wrist_y < nose_y && right_wrist_x < right_elbow_x) {
                console.log("stretch 1");
                command = 1;
                }

                if (count === 0) {
                    console.log('DONE');
                    clearInterval(timer);
                    timer = 0; // stop the interval
                    num = num + 1;
                    if (num < total_stretches) {
                        document.getElementById('demo-img').src = list[num];
                        succeeded = false;
                        count = 10;
                    } else {

                    };
                } else if (count < 0) {
                    console.log('Counter should not go below 0');
                    clearInterval(timer); // stop the interval
                    timer_run = false;
                } else {
                    document.getElementById('timer').innerHTML = count;
                    console.log('TIMER IS MOVING!');
                    if (command == 1) {
                        document.getElementById('timer').innerHTML = count;
                        document.getElementById('stretch-text').innerHTML = "You did it! Now Keep the Stretch for 10 more seconds!";
                        if (succeeded == false) {
                            succeeded = true;
                            score = score + count;
                            count = 10;
                        }
                    } else {
                    // When the timer is equal to 0 we will redirect to a tutorial page
                        }
                }
            }, 1000);
            console.log('TIMER IS STARTED!');
        } else {
            console.log('TIMER IS ALREADY RUNNING!');
        }
	},
    get_left_wrist_command: function (frame) {
		if (frame.people.length < 1) {
			return null;
		}
		positions = frame.people[0];
	},
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