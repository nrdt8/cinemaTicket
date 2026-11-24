const FilmCard = ({film}) => {
    return (
        <div>
            <div>{film.title}</div>
            <div>{film.poster}</div>
        </div>
    )
}

export default FilmCard