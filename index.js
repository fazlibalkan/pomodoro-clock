const audio = document.getElementById("beep");

class App extends React.Component {
    state = {
        breakCount: 5,
        sessionCount: 25,
        clockCount: 25 * 60,
        currentTimer: "Session",
        isPlaying: false,
    }
    
    constructor(props) {
        super(props);
        this.loop = undefined;
    }

    componentWillUnmount() {
        clearInterval(this.loop);
    }
    
    handlePlayPause = () => {
        const {isPlaying} = this.state;
        
        if (isPlaying) {
            clearInterval(this.loop);
            this.setState({
                isPlaying: false
            });
        } else {
            this.loop = setInterval(() => {
                
                const {
                    clockCount, 
                    currentTimer, 
                    breakCount, 
                    sessionCount
                } = this.state;

                
                this.setState({
                    clockCount: clockCount - 1
                });
                
                if (clockCount === 0) {
                    this.setState({
                        currentTimer: (currentTimer === "Session") ? "Break" : "Session",
                        clockCount: (currentTimer === "Session") ? (breakCount * 60) : (sessionCount * 60)
                    });

                    audio.play();
                }
                
            }, 1000);

            this.setState({
                isPlaying: true
            });
        }
    }

    handleReset = () => {
        this.setState({
            breakCount: 5,
            sessionCount: 25,
            clockCount: 25*60,
            currentTimer: "Session",
            isPlaying: false,
        });
        clearInterval(this.loop);
        audio.pause();
        audio.currentTime = 0;
    }

    convertToTime = (count) => {
        let minutes = Math.floor(count / 60);
        const seconds = count % 60;
        const extrazero = "";

        if (count === 3600) {
            minutes = 60;
        }

        if (minutes < 10) {
            if (seconds < 10) {
                return `0${minutes}:0${seconds}` ;
            } else {
                return `0${minutes}:${seconds}` ;
            }
        }else {
            if (seconds < 10) {
                return `${minutes}:0${seconds}` ;
            } else {
                return `${minutes}:${seconds}` ;
            }
        }

        
        
    }

    handleBreakDecrease = () => {

        const { breakCount } = this.state;
        
        if (breakCount != 1) {
            this.setState({
                breakCount: breakCount -1
            });
        }

        
    }

    handleBreakIncrease = () => {
        const { breakCount } = this.state;

        if (breakCount != 60) {
            this.setState({
                breakCount: breakCount +1
            });
        }
    }
    
    handleSessionDecrease = () => {
        const { sessionCount, clockCount} = this.state;

        if (sessionCount != 1) {
            this.setState({
                sessionCount: sessionCount -1,
                clockCount: (sessionCount - 1) * 60
            });
        }
    }

    handleSessionIncrease = () => {
        const { sessionCount, clockCount} = this.state;
        
        if (sessionCount != 60) {
            this.setState({
                sessionCount: sessionCount + 1,
                clockCount: (sessionCount + 1 )* 60
            });
        }
    }

    render() {
        const {
            breakCount, 
            sessionCount, 
            clockCount, 
            currentTimer,
            isPlaying
        } = this.state;

        const breakProps = {
            title: "Break",
            count: breakCount,
            handleDecrease: this.handleBreakDecrease,
            handleIncrease: this.handleBreakIncrease
        }

        const sessionProps = {
            title: "Session",
            count: sessionCount,
            handleDecrease: this.handleSessionDecrease,
            handleIncrease: this.handleSessionIncrease
        }

        return (
            <div>
                <div className="title">
                    <h1>Pomodoro Clock</h1>
                </div>

                <div className="flex">
                    <SetTimer {...breakProps} />
                    <SetTimer {...sessionProps}/>
                </div>
            
                <div className="clock-container">
                    <h1 id="timer-label">{currentTimer}</h1>
                    <span id="time-left">{this.convertToTime(clockCount)}</span>

                    <div className="flex">
                        <button id="start_stop" onClick={this.handlePlayPause}>
                            <i className={`fas fa-${isPlaying ? "pause": "play"}`} />
                        </button>
                        <button id="reset" onClick={this.handleReset}>
                            <i className="fas fa-sync" />
                        </button>
                    </div>
                </div>

            </div>
        );
    }
}

const SetTimer = (props) => {
    const id = props.title.toLowerCase();

    return (
        <div className="timer-container">
            <h2 id={`${id}-label`}>{`${props.title} Length`}</h2>
            <div className="flex actions">
                <button onClick={props.handleDecrease} id={`${id}-decrement`}>
                    <i className="fas fa-minus " />
                </button>
                <span id={`${id}-length`}>{props.count}</span>
                <button onClick={props.handleIncrease} id={`${id}-increment`}>
                    <i className="fas fa-plus" />
                </button>

            </div>
        </div>
    );
}
ReactDOM.render(<App/>, document.getElementById('root'));