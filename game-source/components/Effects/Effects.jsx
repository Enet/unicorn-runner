import Tcaer from 'tcaer';

import './Effects.styl';

import slowImage from 'menu/slow.png';
import fastImage from 'menu/fast.png';
import flyImage from 'menu/fly.png';

const images = {
    slow: slowImage,
    fast: fastImage,
    fly: flyImage
};

export default class Effects extends Tcaer.Component {
    render () {
        return <div className="effects">
            {this.props.value.map((effectName) => {
                return <img
                    className="effects__effect"
                    key={effectName}
                    src={images[effectName]} />
            })}
        </div>
    }
}
