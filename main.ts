input.onButtonPressed(Button.A, function () {
    control.raiseEvent(
    0,
    0
    )
})
input.onSound(DetectedSound.Loud, function () {
    control.raiseEvent(
    5,
    5
    )
})
input.onButtonPressed(Button.B, function () {
    control.raiseEvent(
    1,
    1
    )
})
input.onGesture(Gesture.Shake, function () {
    control.raiseEvent(
    3,
    3
    )
})
function changeMood (change: number) {
    organism.mood += change;
}
let print = function (text: string) {
    serial.writeLine(`[OUTPUT] (${input.runningTime()}) text`);
}
let error = function (text: string) {
    serial.writeLine(`[ERROR] (${input.runningTime()}) text`);
}
const enum dataType {
    wantHistory,
    fullfilmentTime,
    moodGraph
}
const enum faces {
    happy,
    neutral,
    sad,
    dead
}
class Want {
    index: number;
    sound: SoundExpression;
    name: string;

    constructor(i: number, s: SoundExpression, n: string) {
        this.index = i;
        this.sound = s;
        this.name = n;
    }
}
class DataHandler {
    wantHistory: Want[];

    constructor() {
        this.wantHistory = [];
    }

    addData(dType: dataType, data: any) {

    }

    sendData(dType: dataType, data: any) {
        switch (dType) {
            case dataType.fullfilmentTime:
                // Fulllfilment time, record timestamp + time
                let packet = `ft:${data[0]},${data[1].name},${data[2]}`;
        }
    }
}
let wants = [
new Want(0, soundExpression.spring, "A"),
new Want(1, soundExpression.giggle, "B"),
new Want(2, soundExpression.yawn, "Sleep"),
new Want(3, soundExpression.hello, "Play")
]
let showFace = function(face: faces) {
    switch (face) {
        case faces.happy:
            basic.showLeds(`
                # # . # #
                . . . . .
                # # . # #
                # # . # #
                # # . # #`);
            break;
        case faces.neutral:
            basic.showLeds(`
                # # . # #
                . . . . .
                # # . # #
                # # . # #
                . . . . .`);
            break;
        case faces.sad:
            basic.showLeds(`
                . # . # .
                # . . . #
                # # . # #
                # # . # #
                . . . . .`);
            break;
        case faces.dead:
            basic.showLeds(`
                . # . # .
                # . . . #
                . . . . .
                # # . # #
                . . . . .`);
            break;
    }
}
class Organism {
    dataHandler: DataHandler;
    mood: number;

    constructor() {
        this.dataHandler = new DataHandler();
        this.mood = 50;
    }

    showMood = function (mood: number) {
        if (mood > 0 && mood < 25) showFace(faces.sad);
        else if (mood >= 25 && mood < 75) showFace(faces.neutral);
        else if (mood >= 75) showFace(faces.happy);
        else showFace(faces.dead);
    }

    request() {
        let want = wants[randint(0, wants.length - 1)];
        input.calibrateCompass();

        music.play(want.sound, music.PlaybackMode.UntilDone);
        basic.showNumber(want.index); // Remove when verified that sound works
        let start = input.runningTime(); // The time it made the request

        control.waitForEvent(want.index, want.index);
        let end = input.runningTime(); // The time the request was fulfilled
        
        let diff = end - start; // The fulfilment time in milliseconds

        this.setData(dataType.wantHistory, want); // Add to want history
        this.setData(dataType.fullfilmentTime, [start, want, diff]); // Add fulfilmentTime
    }

    setData(dType: dataType, data: any) {
        this.dataHandler.addData(dType, data);
    }
}
let organism = new Organism();
let getMood = function() {
    return organism.mood;
}
basic.forever(function () {
    while (true) {
        organism.request();
    }
})
control.inBackground(function () {
	
})