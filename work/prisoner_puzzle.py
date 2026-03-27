"""
This module solves the classic "Two Prisoners and a Chessboard" puzzle.

The Strategy:
The solution uses a strategy based on the bitwise XOR operation. Each square on the
8x8 chessboard is assigned a number from 0 to 63. The state of the board is
encoded by calculating the XOR sum of the numbers corresponding to the squares
with coins facing "tails" up.

Alice's role is to receive the "correct" square's number from the warden. She then
calculates the XOR sum of the current board state. To encode the correct square's
location, she flips a single coin such that the new XOR sum of the "tails" coins
equals the number of the correct square. The coin she chooses to flip is determined
by XORing the current sum with the target number (the correct square's number).

Bob's role is to decode the board state. He simply calculates the XOR sum of the
positions of all "tails" coins on the board. This sum directly reveals the number
of the "correct" square, which he then converts back to row and column coordinates.
"""

def Alice_action(board, correct_square):
    """
    Determines which coin to flip to encode the location of the correct square.

    The function calculates the XOR sum of the positions of all 'T' (tails) coins.
    It then determines which coin to flip so that the new XOR sum equals the
    numerical representation of the correct square.

    Args:
        board (list of lists): The initial state of the 8x8 chessboard.
                                 'H' for heads, 'T' for tails.
        correct_square (tuple): The (row, col) of the correct square.

    Returns:
        tuple: The (row, col) of the coin to be flipped.
    """
    current_xor_sum = 0
    for r in range(8):
        for c in range(8):
            if board[r][c] == 'T':
                # Convert (row, col) to a single number and XOR it
                current_xor_sum ^= (r * 8 + c)

    # Convert the correct square's coordinates to its numerical representation
    correct_square_num = correct_square[0] * 8 + correct_square[1]

    # Determine the square to flip by XORing the current state with the target state
    flip_square_num = current_xor_sum ^ correct_square_num

    # Convert the numerical representation back to (row, col)
    flip_row = flip_square_num // 8
    flip_col = flip_square_num % 8

    return (flip_row, flip_col)

def Bob_action(board):
    """
    Decodes the information from the board to identify the correct square.

    The function calculates the XOR sum of the positions of all 'T' (tails) coins.
    This sum directly corresponds to the numerical representation of the correct
    square.

    Args:
        board (list of lists): The final state of the 8x8 chessboard after Alice
                                 has flipped one coin.

    Returns:
        tuple: The (row, col) of the correct square.
    """
    xor_sum = 0
    for r in range(8):
        for c in range(8):
            if board[r][c] == 'T':
                # Convert (row, col) to a single number and XOR it
                xor_sum ^= (r * 8 + c)

    # The resulting XOR sum is the number of the correct square
    correct_row = xor_sum // 8
    correct_col = xor_sum % 8

    return (correct_row, correct_col)
