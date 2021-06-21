module.exports = {
    ifeq: function(a, b, options){
      if (a === b) {
        return options.fn(this);
        }
      return options.inverse(this);
    },
    isModerator: function(arg1, arg2, options) {
        return (arg1 == "moderator" || arg1 == "admin") ? arg2.fn(this) : arg2.inverse(this);
    },
}