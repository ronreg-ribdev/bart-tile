import _ from 'lodash';


export class UpdateReducer {
    reduce(json, state) {
        let data = _.get(json, 'update', false);
        if (data) {
            const stations = _.get(data, 'stations', false);
            if (stations) {
                state.stations = stations;
            }
        }
    }
}
