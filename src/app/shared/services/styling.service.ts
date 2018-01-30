import { Injectable } from '@angular/core';

@Injectable()
export class StylingService 
{
    public Primary_Colour: Map<string, string>;
    public Hex_Primary_Colour: Map<string, string>;

    constructor() 
    {
        this.initMemberVariables();
    }

    private initMemberVariables(): void
    {
        this.Primary_Colour = new Map();
        this.Primary_Colour.set("red", "rgb(224, 18, 29)")
        this.Primary_Colour.set("gray", "rgb(153, 153, 153")
        this.Primary_Colour.set("black", "rgb(41, 49, 59)")

        this.Hex_Primary_Colour = new Map();
        this.Hex_Primary_Colour.set("gray", "#999999")
        this.Hex_Primary_Colour.set("black", "#29313b")
        this.Hex_Primary_Colour.set("red", "#f4121d")
        
    }

    public getPrimaryColour(colour: string)
    {
        if (colour === "grey")
            colour = "gray"
        
        return this.Primary_Colour.get(colour);
    }

    public getHexPrimaryColour(colour: string) 
    {
        if (colour === "grey")
            colour = "gray"

        return this.Hex_Primary_Colour.get(colour);
    }
}