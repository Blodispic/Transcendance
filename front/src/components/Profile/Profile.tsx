import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { IUser } from '../../interface/User';
import '../../styles/profile.scss';
import { HiOutlineMagnifyingGlassCircle } from "react-icons/hi2";


function Search(props: { user: IUser }) {

        const { user } = props;
        const [man, setMan] = useState<string | undefined> (undefined)

        const search_man = async (e: any) => {
              
                e.preventDefault();
                        const response = await fetch(`${process.env.REACT_APP_BACK}/user/${man}`, {
                                method: 'GET',
                        })
                        const data = response.json();
                }
        
        

        return (
                <div className="search">
                        <div className="icon" onClick={(e) => search_man(e)}>
                                <HiOutlineMagnifyingGlassCircle />
                        </div>
                        <div className="input">
                                <input type="text" onChange={e => setMan(e.target.value)} placeholder="Search..." />
                        </div>
                </div>
        )
}

function Header(props: { user: IUser }) {

        const { user } = props;

        return (
                <div className='profile-header'>


                        <Search user={user} />

                        <div className='info-container'>
                                <div className="left-part">
                                        <div className='avatar'>
                                                <img className='logo' src={`${process.env.REACT_APP_BACK}/user/${user.id}/avatar`} />
                                        </div>
                                </div>



                                <div className='info-header'>

                                        <div className='stat-header'>
                                                <span>test</span>
                                                <span>test</span>
                                                <span>test</span>

                                                <div className='rank'>
                                                        <span>RANK</span>
                                                        <span className='rank'>GOLD II </span>
                                                </div>
                                        </div>

                                        <div className='block'>

                                                <div className='block'>
                                                        <span>{user.username}</span>

                                                </div>

                                                <div className=' block'>
                                                        <span >{user.status}</span>
                                                </div>
                                        </div>
                                </div>

                        </div>

                </div>
        )

};
const icon = document.querySelector(".icon");
const search = document.querySelector(".search");



export default function Profile() {
        const [user, setUser] = useState<IUser | undefined>(undefined);
        let avatar: string = "";
        let { id } = useParams();

        useEffect(() => {
                if (id) {
                        const fetchid = async () => {
                                const response = await fetch(`${process.env.REACT_APP_BACK}/user/${id}`, {
                                        method: 'GET',
                                })
                                setUser(await response.json());
                        }
                        fetchid()
                        console.log();

                }
        }, [])

        console.log(user);
        console.log("avatar", avatar);

        if (user === undefined || avatar === undefined) {
                return (
                        <div className='center'>
                                <h1>USER DONT EXIST </h1>
                        </div>
                );
        }
        return (
                <div className='all'>
                        <section>

                        </section>
                        <Header user={user} />
                        <div className='cacher'>

                        </div>
                </div>
        );


}