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

    constructor(i: number, s: SoundExpression) {
        this.index = i;
        this.sound = s;
    }
}
let wants = [
new Want(0, soundExpression.spring),
new Want(1, soundExpression.giggle),
new Want(2, soundExpression.yawn),
new Want(3, soundExpression.hello)
]
let showFace = function (face: faces) {
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
    wantHistory: Want[];
    mood: number;

    constructor() {
        this.wantHistory = [];
        this.mood = 50;
    }

    showMood = function (mood: number) {
        if (mood > 0 && mood < 25) showFace(faces.sad);
        else if (mood >= 25 && mood < 75) showFace(faces.neutral);
        else if (mood >= 75) showFace(faces.happy);
        else showFace(faces.dead);
    }

    request = function () {
        let want = wants[randint(0, wants.length - 1)];
        input.calibrateCompass();

        music.play(want.sound, music.PlaybackMode.UntilDone);
        basic.showNumber(want.index); // Remove when verified that sound works
        let start = input.runningTime();

        control.waitForEvent(want.index, want.index);
        let end = input.runningTime();
        
        let diff = end - start;

        organism.wantHistory.push(want);
        // TODO: Setup with data logging
        print(`${organism.wantHistory[organism.wantHistory.length - 1].index}`);
    }

    sendData = function (dType: dataType, data: any) {
        switch (dType) {
            case dataType.fullfilmentTime:
                // Fulllfilment time, record timestamp + time
                let packet = `ft:${data[0]},${data[1]},${data[2]}`;
        }
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
// Test