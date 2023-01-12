import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

// char__item_selected

const CharItem = (props) => {
    const {img, name, charID, onCharSelected} = props;
    const imgExists = !img.includes('image_not_available');
    const imgStyle = imgExists ? null : {objectPosition: 'left'};
    return (
        <li className="char__item" onClick={() => onCharSelected(charID)}>
            <img src={img} alt={name} style={imgStyle} />
            <div className="char__name">{name}</div>
        </li>
    )
}

const CharGrid = (props) => {
    const {elems} = props;
    return (
        <ul className="char__grid">
            {elems}
        </ul>
    )
}

const marvelService = new MarvelService();

class CharList extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210, // 1562 total
        charsEnded: false
    }
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }
    onCharsLoaded = (chars) => {
        let ended = false;
        let limit = 9;
        if (chars.length < 9) {
            limit = chars.length;
            ended = true;
        }
        const newChars = chars.map(char => ({name: char.name, thumbnail: char.thumbnail, id: char.id}));
        this.setState(({offset, chars}) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + limit,
            charEnded: ended
        }));
    }
    onError = () => {
        this.setState({
            error: true, 
            loading: false,
            newItemLoading: false
        })
    }
    getChars = (offset) => {
        let limit;
        if (this.state.offset + 9 > 1562) {
            limit = 1562 - this.state.offset;
        }
        this.onCharListLoading();
        marvelService
            .getAllCharacters(offset, limit)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }
    transformChars = () => {
        const {chars} = this.state;
        return chars.map(char => (
            <CharItem 
                img={char.thumbnail} 
                name={char.name} 
                charID={char.id}
                key={char.id}
                onCharSelected={this.props.onCharSelected} />
        ));
    }
    componentDidMount = () => {
        this.getChars();
    }
    render() {
        const charElems = this.transformChars();
        const {loading, error, offset, newItemLoading, charEnded} = this.state;
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? <CharGrid elems={charElems}/> : null; 

        const btnStyle = newItemLoading ? {filter: 'grayscale(1)', opacity: '.5', cursor: 'not-allowed'} : null;
        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
                <button 
                    onClick={() => {this.getChars(offset)}} 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{...btnStyle, display: charEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;