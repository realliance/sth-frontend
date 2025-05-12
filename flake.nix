{
  description = "Small Turtle House Frontend";

  inputs = {
    nixpkgs.url = "nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        
        nodejs = pkgs.nodejs_22;
        
        nodeEnv = {
          inherit nodejs;
          npm = nodejs.pkgs.npm;
        };
      in
      {
        # Development shell
        devShells.default = pkgs.mkShell {
          buildInputs = [
            nodeEnv.nodejs
            nodeEnv.npm
          ];
        };

        # Build the React application
        packages.default = pkgs.stdenv.mkDerivation {
          name = "sth-frontend";
          src = ./.;
          
          buildInputs = [
            nodeEnv.nodejs
            nodeEnv.npm
          ];
          
          buildPhase = ''
            # Ensure npm doesn't try to go online
            export HOME=$TMPDIR
            
            # Install dependencies
            npm install
            
            # Build the application
            npm run build 
          '';
          
          installPhase = ''
            # Copy the build output to the Nix store
            mkdir -p $out
            cp -r build/dist/* $out/
          '';
        };
      }
    );
}