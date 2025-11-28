export type BetOptionsData = {
    over?: number;
    under?: number;
    even?: number;
    odd?: number;
    home?: number;
    away?: number;
    draw?: number;
    [key: string]: number | undefined;
};
