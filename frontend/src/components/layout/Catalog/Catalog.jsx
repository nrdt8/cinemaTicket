    import FilmCard from "../../ui/FilmCard/FilmCard.jsx";
    import {useEffect, useState} from "react";

    const Catalog = () => {

        const [films, setFilms] = useState([]);

        useEffect(() => {
            const getFilms = async () => {
                try {
                    const response = await fetch(
                        "http://localhost:3000/api/movies/",
                        {
                            method: "GET"
                        }
                    )

                    const data = await response.json()


                    setFilms(data.data);


                } catch (err) {
                    console.log(err)
                }
            }

            getFilms()
        }, [])

        return (
            <div>
                {films.map((film) => (
                    <FilmCard key={film.movie_id} film={film} />
                ))}
            </div>
        )
    }

    export default Catalog;