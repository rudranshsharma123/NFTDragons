import * as s from "../styles/globalStyles"
import DragonNFTGen from '../components/DragonNFTGen';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'

import { connect } from '../redux/blockchain/blockchainActions'
import { fetchData } from '../redux/data/dataActions';
import { addName } from "../redux/data/dataActions";
import Web3 from 'web3';
import FightPage from "./fightPage";
export default function MintPage() {
    const dispatch = useDispatch();
    let selectedDragon;
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    // console.log(data);
    // This is the fighting function which goes to the blockchain to actually fight!
    
    const fightMe = (account, _attackerId, _defenderId) => {

        console.log(Number(data.name), _attackerId, _defenderId);
        blockchain.dragonToken.methods.fight(Number(_attackerId), Number(_defenderId)).send({ from: account }).once(
            "error", (error) => {
                console.log(error);
            }
        ).then((receipt) => {
            console.log(receipt);
            dispatch(fetchData(account));
        });
    }
        // This is the Minting function which goes to the blockchain to actually mint NFTs!

    const mintNFT = (account, _name) => {
        blockchain.dragonToken.methods.createRandomDragon(_name).send({ from: account, value: Web3.utils.toWei('0.01', 'ether') }).once(
            "error", (error) => {
                console.log(error);
            }
        ).then((receipt) => {
            console.log(receipt);
            dispatch(fetchData(account));
        });
    }
    console.log("not owner dragons", data.allNotOwnerDragons);
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
                    <s.TextTitle>Welcome to the Game</s.TextTitle>
                    <s.SpacerSmall />
                    <button onClick={(e) => { e.preventDefault(); mintNFT(blockchain.account, "lol") }}>Create NFT</button>
                    <s.SpacerSmall />
                    <s.Container style={{ padding: "10px", flexWrap: "wrap" }} fd={"row"} jc={"center"} >
                        {data.allOwnerDragons.map((dragon, index) => {
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
                                            <button onClick={(e) => { e.preventDefault(); selectedDragon = dragon.id }}>Fight using me</button>
                                        </s.Container>
                                        <s.Container style={{ paddingTop: "10px" }}>


                                        </s.Container>
                                    </s.Container>

                                </div >
                            );
                        })}
                    </s.Container>
                    <s.SpacerMedium />
                    <s.Container style={{ padding: "10px", flexWrap: "wrap" }} jc={"center"} ai={"center"} >
                        <s.TextTitle>Not your dragons, But Well you can fight them</s.TextTitle>
                        <s.SpacerXSmall />
                        <s.TextTitle>Click on the Fight Button to get to fighting</s.TextTitle>
                        <s.SpacerXSmall />
                        <s.TextTitle>Remeber you have about 70% chance of winning if you attack </s.TextTitle>
                        <s.SpacerXSmall />
                        <s.TextTitle>If you win you will level up your dragon and it Will eveolve as well!! </s.TextTitle>



                    </s.Container>
                    <s.Container fd={'row'} jc={"center"}>
                        {data.allNotOwnerDragons.map((dragon, index) => {
                            return (
                                <div key={index}>
                                    <s.Container style={{ padding: "15px" }}>

                                        <DragonNFTGen dragon={dragon} />

                                        <s.SpacerXSmall />
                                        <s.Container>
                                            <s.TextDescription>ID {dragon.id}</s.TextDescription>
                                            <s.TextDescription>DNA {dragon.dna} </s.TextDescription>
                                            <s.TextDescription>Level {dragon.level} </s.TextDescription>
                                            <s.TextDescription>Name {dragon.name} </s.TextDescription>
                                            <s.TextDescription>Rarity {dragon.rarity} </s.TextDescription>
                                            <s.TextDescription>Win Count {dragon.winCount} </s.TextDescription>
                                            <s.TextDescription>Loss Count {dragon.lossCount} </s.TextDescription>
                                            <s.TextDescription>Total Battles Fought {dragon.totalBattles} </s.TextDescription>
                                            <button onClick={(e) => { e.preventDefault(); fightMe(blockchain.account, selectedDragon, dragon.id) }}>Fight me</button>
                                        </s.Container>
                                        <s.Container style={{ paddingTop: "10px" }}>


                                        </s.Container>
                                    </s.Container>

                                </div >
                            );
                        })}
                    </s.Container>


                </s.Container>}

            <s.SpacerMedium />


        </s.Screen >);
}
