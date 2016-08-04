if(!utils)var utils={};

(function(utils)
{
	var timers  = timers || {};	
	var CURRENT = CURRENT || null;
	var COUNTER = COUNTER || 0;


	var __exec =(function(state, timer){
		switch(state){
           case Timer.PENDING:
            timer.kill();
            timers[timer.tname].state=Timer.KILLED;

            break;
           case Timer.KILLED:
            timer.kill();
           break;
		}
	})
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
      timers[this.tname]={id:this.tid, timer:this, state: Timer.PENDING}
	});

	Timer.prototype.start =(function(callback)
	{   
		if(!callback || timers[this.tname].state===Timer.KILLED) return;
         
	    timers[this.tname].state= Timer.WAITING;
	    timers[this.tname].callback= callback;
		this.interval = (typeof this.interval==="number"&& this.interval >=0)?this.interval: 1000;
	    this.repeats = (typeof this.repeats==="number" && this.repeats > 0)?this.repeats: null;
	    this.id = window.setInterval((function()
	    {
	    	timers[this.tname].state= Timer.ACTIVE;
	    	CURRENT=this;
	    	if(this.repeats!=null)
	    	{
	    		this.count++;
	    		if(this.count >= this.repeats)
	    			this.kill();
	    	}

	       if(typeof callback ==='function'){
	       	  callback.apply(null,[timers[this.tname].id]);
	       	  timers[this.tname].state= Timer.WAITING;
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
	   timers[this.tname].state= Timer.KILLED;
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

	Timer.execute  =(function(name, state){
     if(typeof name !='string')
     	var state = name;
    var timer =null;
     if(timers[name]){
     	 timer ==timers[name];
     }
     if(typeof state ==='number'){
       if(timer){
       	   __exec(state, timer);
       	   return;
       }
      for(p in timers){
      	var struct =timers[p];
      	timer = struct.timer;
        __exec(state, timer);
      }
     }
  
	})

   Timer.PENDING = 0;
   Timer.WAITING = 1;
   Timer.ACTIVE  = 2;
   Timer.KILLED  = 3;
   utils.Timer = Timer;
})(utils);
