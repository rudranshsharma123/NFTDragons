
import { Link } from 'react-router-dom'

import * as s from "../styles/globalStyles"
import DragonNFTGen from '../components/DragonNFTGen';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';

import { connect } from '../redux/blockchain/blockchainActions'
import { fetchData } from '../redux/data/dataActions';

import Web3 from 'web3';
export default function FightPage(props) {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const id = data.name;
    console.log(data.name);
    console.log(props);
    const fightMe = (account, _defenderId) => {

        console.log(Number(data.name), _defenderId, data.name, id);
        // blockchain.dragonToken.methods.fight(_attackerId, _defenderId).send({ from: account }).once(
        //     "error", (error) => {
        //         console.log(error);
        //     }
        // ).then((receipt) => {
        //     console.log(receipt);
        //     dispatch(fetchData(account));
        // });
    }

    useEffect(() => {
        if (blockchain.account !== "") {
            dispatch(fetchData(blockchain.account));
        }
    }, [blockchain.account]);

    return (
        <s.Screen>
            {blockchain.account === "" || blockchain.dragonToken === null ? <s.Container flex={1} ai={"center"} jc={"center"}>
                <s.TextTitle>
                    Connect to the game
                </s.TextTitle>
                <s.SpacerMedium />
                <button onClick={(e) => { e.preventDefault(); dispatch(connect()) }}>connect</button>
            </s.Container> :
                <s.Container ai={"center"} style={{ padding: "20px" }} >
                    <s.TextTitle>Welcome to the Fight Screen</s.TextTitle>
                    <s.SpacerXSmall />
                    <s.TextTitle>
                        Choose the Dragoon you want to fight
                    </s.TextTitle>
                    <s.SpacerXSmall />
                    <s.TextTitle>
                        Remeber if you attack you have 70% chance to win
                    </s.TextTitle>
                    <s.SpacerSmall />
                    <s.SpacerSmall />
                    <s.Container style={{ padding: "10px", flexWrap: "wrap" }} fd={"row"} jc={"center"} >
                        {data.allNotOwnerDragons.map((dragon, index) => {
                            return (
                                <div key={index}>
                                    <s.Container style={{ padding: "15px" }}>

                                        <DragonNFTGen dragon={dragon} />

                                        <s.SpacerXSmall />
                                        <s.Container>
                                            <s.TextDescription>ID {dragon.id}</s.TextDescription>
                                            <s.TextDescription>DNA {dragon.dna} </s.TextDescription>
                                            <s.TextDescription>Levek {dragon.level} </s.TextDescription>
                                            <s.TextDescription>Name {dragon.name} </s.TextDescription>
                                            <s.TextDescription>Rarity {dragon.rarity} </s.TextDescription>
                                            <s.TextDescription>Win Count {dragon.winCount} </s.TextDescription>
                                            <s.TextDescription>Loss Count {dragon.lossCount} </s.TextDescription>
                                            <s.TextDescription>Total Battles Fought {dragon.totalBattles} </s.TextDescription>
                                            <s.TextDescription>coolDonwnTime {dragon.coolDonwnTime} </s.TextDescription>



                                        </s.Container>
                                        <s.Container style={{ paddingTop: "10px", paddingRight: "10px" }} fd={'row'}>
                                            <Link to="/">
                                                <button >
                                                    MOve to home</button></Link>
                                            <button style={{ marginLeft: "10px" }} onClick={(e) => { e.preventDefault(); fightMe(blockchain.account, dragon.id) }}>
                                                Fight Me</button>
                                        </s.Container>
                                    </s.Container>

                                </div >
                            );
                        })}
                    </s.Container>


                </s.Container>}

            <s.SpacerMedium />


        </s.Screen >
    );
}