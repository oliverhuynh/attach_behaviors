import { debounce } from 'throttle-debounce';
export const jQuery = require("jquery");
export const Behaviors = {behaviors: {}};
export const $ = jQuery;
Behaviors.attachBehaviors = function (context, settings) {
// Behaviors.attachBehaviors = function (context, settings) {
  if (this._in_attaching) {
    return ;
  }
  this._in_attaching = true;

  // Prepare the behavior
  var count = 0;
  $.each(Behaviors.behaviors, function(v, b) {
    if ($.isFunction(Behaviors.behaviors[v])) {
      Behaviors.behaviors[v] = {
        'attach': Behaviors.behaviors[v]
      };
    }
    if ($.isFunction(Behaviors.behaviors[v].attach)) {
      count++;
      Behaviors.behaviors[v]._attachPriority = Behaviors.behaviors[v]._attachPriority || ('0.' + count);
    }
  });

  // console.warn(Object.keys(Behaviors.behaviors));
  // Sore with weight
  var newBehaviors = Object.keys(Behaviors.behaviors).sort(function(a, b) {
    var k1, k2;
    k1 = parseFloat(Behaviors.behaviors[a]._attachPriority);
    k2 = parseFloat(Behaviors.behaviors[b]._attachPriority);
    return k1 - k2;
  });

  // Do normal attach with new queue
  context = context || document;
  settings = settings || Behaviors.settings;

  $( document ).trigger( "attachBehaviors_start" , [ context, settings ]);
  // console.warn(newBehaviors[0]);
  // Behaviors._attachBehaviors(context, settings);
  $.each(newBehaviors, function(k, v) {
    if ($.isFunction(Behaviors.behaviors[v].attach)) {
      try {
        Behaviors.behaviors[v].attach(context, settings);
      }
      catch (e) {
        console.warn('Behaviors wrong');
        console.warn(e);
      }
    }
  });
  $( document ).trigger( "attachBehaviors_end" , [ context, settings ]);
  this._in_attaching = false;
// };
}.bind(Behaviors);
Behaviors.slowAttachBehaviors = debounce(500, false, Behaviors.attachBehaviors);
