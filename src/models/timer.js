import Model from 'redux-easy-models';

// helper function to simulate an async operation
// this could easily be a network request.
function delay() {
  return new Promise(resolve=>setTimeout(resolve, 2000));
}

const timer = {

  //the name of the model. we will use this name to force
  //a convention where every action will have a type with
  //the name as the prefix. Can be used to combine reducers
  //as well. ie:
  //   const reducers = combineReducers({
  //     [timerModel.name]: timerModel.reducer
  //   });
  name: 'timer',
  
  //reducer's initial state.
  initialState: { started: false, count: 0, timerId: null },
  
  //actions can either be strings or named functions.
  actions: [
    //in case of strings, action creators will be generated
    //with redux-actions. the name of the model will be used
    // as a prefix as well, ie:
    //    let actionCreator = createAction('TIMER_INCREASE');
    'increase',
    'clear',
    //functions should be named and will automatically
    //generate two actions, one when the execution starts,
    //one in case of success or failure.
    //action types will follow an upper snake convention with
    //the name as the prefix, ie:
    //  function startMySuperTimer() {...
    //will be translated to an action type of:
    //  TIMER_START_MY_SUPER_TIMER_START
    //  TIMER_START_MY_SUPER_TIMER_SUCCESS
    //  TIMER_START_MY_SUPER_TIMER_FAIL
    function start() {
      this.clear();
      return setInterval(this.increase, 1000);
    },
    function getTimerId() {
      return this.getMyState().timerId;
    },
    function stop() {
      let timerId = this.getTimerId();
      clearInterval(timerId);
    },
    //functions can be async and/or return a promise,
    //and the right success/fail action will be generated based
    //on whether the promise is resolved/rejected.
    //in case the function is not async and is sync,
    //start/success/fail actions will also be generated, and
    //the execution will be wrapped in a try/catch statement
    async function delayStart() {
      await delay();
      this.start();
    }
  ],
  
  //reducers can be defined for actions generated by this model.
  //no need to use prefix, and sufix in the case of 'Success' is
  //options, so in the following list 'start' and 'startSuccess'
  //are pretty much the same.
  reducers: {
    start: (state, action) => {
      return Object.assign({}, state, { started: true, timerId: action.payload });
    },
    stopSuccess: (state/*, action*/) => {
      return Object.assign({}, state, { started: false, timerId: null });
    },
    //remember that actions generated with strings in the 'actions'
    //definition will not generate start/success/fail actions, so
    //in this case, 'increaseSuccess' and increaseFail will not work and
    //will never be called.
    increase: (state/*, action*/) => {
      return Object.assign({}, state, { count: state.count + 1});
    },
    clear: (state /*, action*/) => {
      return Object.assign({}, state, { count: 0 });
    }
  }
};

export default new Model(timer);