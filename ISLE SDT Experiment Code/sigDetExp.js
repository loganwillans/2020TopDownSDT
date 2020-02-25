// values to run the method of limits activity using the dot lum to cacl a threshold.
function SigDetExp() {
    this.methodIVIndex = -1; // -1 indicates a signal detection experiment.
    this.variablesToShow = [true, false, false, true, true, false, false, true]; // hid the IV from the stimulus setup
    this.respArea = true; // is there a response areal to take into account.
    this.respCanvasHeight = 5;

    // values for the sliders for the iv for the Psychophysical method
    // these values are needed in Method of Limits, Method of Constant Stimuli, and Forced Choice
    this.ivLoMin = 0; // minimum value for slide of the lowest value of the experiment method
    this.ivLoMax = 25; // the maximum value for the low end of the IV
    this.ivHighMin = 20; // the minimum value for the high end of the Iv
    this.ivHighMax = 50; // the maximum value for the high end of the IV
    this.ivLoDef = 1; // default low end of IV
    this.ivHighDef = 50; // default of the high end of the IV
    this.ivMinStep = 1; // step for the minimum slider
    this.ivMaxStep = 1; // step for the maximum slider
    this.ivInstructions = "There are no special method settings to control an independent variable";
    this.dvUnit = "pixels";
    this.resultsExplanation = "Your results are presented in a table.<br>";
    this.resultsExplanation += "<br>";
    this.resultsExplanation += '"His" will be in the upper left box of the table when there was a target ';
    this.resultsExplanation += 'and you said there was.<br>';
    this.resultsExplanation += '<br>';
    this.resultsExplanation += '"Misses" will be in the lower left box of the table when there was a target ';
    this.resultsExplanation += 'and you said there was not one.<br>';
    this.resultsExplanation += '<br>';
    this.resultsExplanation += '"False Alarms" will be in the upper right box of the table when there was not a target ';
    this.resultsExplanation += 'and you said there was.<br>';
    this.resultsExplanation += '<br>';
    this.resultsExplanation += '"Correct Rejections" will be in the lower right box of the table when there was not a target ';
    this.resultsExplanation += 'and you said there was not one.<br>';
    this.resultsExplanation += '<br>';
    this.resultsExplanation += "The larger your d' the easier time you had seeing the target or signal. ";
    this.resultsExplanation += "The larger your criterion, the more likely you were to say you say the target ";
    this.resultsExplanation += "regardless of if it were present or not.";

    // this experiment uses method of Constant Stimuli
    // parameters to be sent to the method object
    this.methodParam = ["Was there a faster dot"];
    // the first parameter is the question to ask the participant after each trial
    // Not sure what parameters will be sent yet

    this.stimParam = [2000]; // stimulus parameters to send to stimulus  empty in this case

    // parameters for the results object
    this.dvType = "SDT Results"; // what type of DV are we measuring
}