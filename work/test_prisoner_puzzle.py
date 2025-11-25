import unittest
import random
from prisoner_puzzle import Alice_action, Bob_action

class TestPrisonerPuzzle(unittest.TestCase):

    def generate_random_board(self):
        """Generates a random 8x8 board with 'H' or 'T'."""
        return [['H' if random.random() < 0.5 else 'T' for _ in range(8)] for _ in range(8)]

    def test_puzzle_logic(self):
        """
        Tests the end-to-end logic of the puzzle for a number of random scenarios.
        """
        for _ in range(100): # Run 100 random tests
            # 1. Setup a random initial board state
            initial_board = self.generate_random_board()

            # 2. Warden chooses a random "correct" square
            correct_row = random.randint(0, 7)
            correct_col = random.randint(0, 7)
            correct_square = (correct_row, correct_col)

            # 3. Alice determines which coin to flip
            flip_row, flip_col = Alice_action(initial_board, correct_square)

            # 4. Create the final board state by flipping the coin
            final_board = [row[:] for row in initial_board] # Deep copy
            final_board[flip_row][flip_col] = 'T' if final_board[flip_row][flip_col] == 'H' else 'H'

            # 5. Bob determines the correct square from the final board
            bob_choice = Bob_action(final_board)

            # 6. Check if Bob's choice matches the warden's choice
            self.assertEqual(bob_choice, correct_square,
                             f"Failed on board: {initial_board} with correct_square: {correct_square}")

if __name__ == '__main__':
    unittest.main()
