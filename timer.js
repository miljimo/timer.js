if(!utils)var utils={};

(function(utils)
{
	var timers  = timers || {};
	var PENDING = 0;
	var WAITING = 1;
	var ACTIVE  = 2;
	var KILLED  = 3;
	var CURRENT = CURRENT || null;
	var COUNTER = COUNTER || 0;
	var Timer =(function(name, interval, repeats)
	{


       if(typeof name =='number'){
       	  repeats = interval;
       	  interval = name;
       	  name = null;
       }
	   this.interval = (typeof interval==="number"&& interval >=0)?interval: 1000;
	   this.repeats = (typeof repeats==="number"&& repeats > 0)?repeats: null;
	   this.count=0;
	   var name = (typeof name ==='string')?name: Timer.generateUUID();
	   Object.defineProperties(this, {"tname":{value:name,writable:false,enumerable:false}});
	   Object.defineProperties(this, {"tid":{value:(++COUNTER),writable:false,enumerable:false}});
      if(timers[name]) throw new Error("Timer with the given name already exists");
      timers[this.tname]={id:this.tid, timer:this, state: PENDING}
	});

	Timer.prototype.start =(function(callback)
	{   
		if(!callback && timers[this.tname].state==KILLED) return;
	    timers[this.tname].state= WAITING;
		this.interval = (typeof this.interval==="number"&& this.interval >=0)?this.interval: 1000;
	    this.repeats = (typeof this.repeats==="number" && this.repeats > 0)?this.repeats: null;
	    this.id = window.setInterval((function()
	    {
	    	timers[this.tname].state= ACTIVE;
	    	CURRENT=this;
	    	if(this.repeats!=null)
	    	{
	    		this.count++;
	    		if(this.count >= this.repeats)
	    			this.kill();
	    	}

	       if(typeof callback ==='function'){
	       	  callback.apply(null,[timers[this.tname].id]);
	       	  timers[this.tname].state= WAITING;
	       }

	    }).bind(this), this.interval);
	});

	Timer.prototype.state =(function(){
	 return timers[this.tname].state;
	});

	Timer.toString=(function(){
		return "[class Timer]";
	})
	Timer.prototype.toString=(function(){
		return "[object Timer]";
	})

	Timer.prototype.kill =(function()
	{
	   window.clearInterval(this.id);
	   this.repeats=null;
	   this.interval= 1000;
	   timers[this.tname].state= KILLED;
	});

	Timer.Counter =0;
	//static methods
	Timer.generateUUID =(function(len){
	 if(!len)var len=10;
	 return (1+ COUNTER);
	})

	Timer.get=(function(name){
	   return (timers[name])?timers[name]:null;
	});

	Timer.count=(function(){
	   return COUNTER;
	});

	Timer.current=(function(){
	  return CURRENT;
	});


	utils.Timer = Timer;


})(utils);
